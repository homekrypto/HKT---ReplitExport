// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PropertyNFT.sol";
import "./HKTSecurityToken.sol";

/**
 * @title BookingEscrow
 * @dev Escrow contract for property bookings with HKT payments
 * Handles booking deposits, cancellations, and fee distribution
 */
contract BookingEscrow is ReentrancyGuard, Ownable {
    
    PropertyNFT public propertyNFT;
    HKTSecurityToken public hktToken;
    
    struct Booking {
        address booker;
        string propertyId;
        uint256 weekNumber;
        uint256 checkInDate;
        uint256 checkOutDate;
        uint256 totalAmount;
        uint256 platformFee;
        uint256 cleaningFee;
        bool isNFTHolder;
        BookingStatus status;
        uint256 createdAt;
    }
    
    enum BookingStatus {
        Pending,      // Funds escrowed, awaiting check-in
        Active,       // Guest has checked in
        Completed,    // Guest has checked out
        Cancelled,    // Booking cancelled
        Disputed      // Dispute in progress
    }
    
    mapping(bytes32 => Booking) public bookings;
    mapping(string => mapping(uint256 => mapping(uint256 => bool))) public weeklyAvailability;
    
    // Platform settings
    uint256 public platformFeePercentage = 900; // 9% platform fee (in basis points)
    uint256 public cleaningFeeUSD = 90; // $90 cleaning fee
    uint256 public cancellationRefundPercentage = 5000; // 50% refund on cancellation
    address public platformWallet;
    address public propertyOwnerWallet;
    
    // Events
    event BookingCreated(
        bytes32 indexed bookingId,
        address indexed booker,
        string propertyId,
        uint256 weekNumber,
        uint256 totalAmount,
        bool isNFTHolder
    );
    
    event BookingConfirmed(bytes32 indexed bookingId);
    event BookingCancelled(bytes32 indexed bookingId, uint256 refundAmount);
    event BookingCompleted(bytes32 indexed bookingId);
    event FundsReleased(bytes32 indexed bookingId, uint256 amount);
    
    constructor(
        address _propertyNFT,
        address _hktToken,
        address _platformWallet,
        address _propertyOwnerWallet
    ) {
        propertyNFT = PropertyNFT(_propertyNFT);
        hktToken = HKTSecurityToken(_hktToken);
        platformWallet = _platformWallet;
        propertyOwnerWallet = _propertyOwnerWallet;
    }
    
    /**
     * @dev Create a new booking with escrow
     */
    function createBooking(
        string memory propertyId,
        uint256 weekNumber,
        uint256 checkInDate,
        uint256 checkOutDate,
        uint256 hktAmount
    ) external nonReentrant returns (bytes32) {
        require(checkInDate > block.timestamp, "Check-in date must be in the future");
        require(checkOutDate > checkInDate, "Check-out must be after check-in");
        require(hktAmount > 0, "Amount must be greater than 0");
        
        // Check if week is available
        require(!weeklyAvailability[propertyId][weekNumber][getWeekFromTimestamp(checkInDate)], "Week not available");
        
        // Check if user owns the NFT for this property/week
        (bool ownsNFT, uint256 tokenId) = propertyNFT.ownsPropertyWeek(msg.sender, propertyId, weekNumber);
        bool canBookForFree = false;
        
        if (ownsNFT) {
            canBookForFree = propertyNFT.canBookForFree(msg.sender, propertyId, weekNumber);
        }
        
        uint256 totalAmount = hktAmount;
        uint256 platformFee = 0;
        uint256 cleaningFee = 0;
        
        // Calculate fees if not a free NFT booking
        if (!canBookForFree) {
            platformFee = (hktAmount * platformFeePercentage) / 10000;
            cleaningFee = convertUSDToHKT(cleaningFeeUSD);
            totalAmount = hktAmount + platformFee + cleaningFee;
        }
        
        // Transfer tokens to escrow
        require(
            hktToken.transferFrom(msg.sender, address(this), totalAmount),
            "Token transfer failed"
        );
        
        // Generate booking ID
        bytes32 bookingId = keccak256(
            abi.encodePacked(msg.sender, propertyId, weekNumber, checkInDate, block.timestamp)
        );
        
        // Create booking record
        bookings[bookingId] = Booking({
            booker: msg.sender,
            propertyId: propertyId,
            weekNumber: weekNumber,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            totalAmount: totalAmount,
            platformFee: platformFee,
            cleaningFee: cleaningFee,
            isNFTHolder: ownsNFT,
            status: BookingStatus.Pending,
            createdAt: block.timestamp
        });
        
        // Mark week as unavailable
        weeklyAvailability[propertyId][weekNumber][getWeekFromTimestamp(checkInDate)] = true;
        
        // Mark NFT free week as used if applicable
        if (canBookForFree) {
            propertyNFT.markFreeWeekUsed(tokenId);
        }
        
        emit BookingCreated(bookingId, msg.sender, propertyId, weekNumber, totalAmount, ownsNFT);
        return bookingId;
    }
    
    /**
     * @dev Confirm booking (called on check-in)
     */
    function confirmBooking(bytes32 bookingId) external onlyOwner {
        Booking storage booking = bookings[bookingId];
        require(booking.status == BookingStatus.Pending, "Booking not pending");
        require(block.timestamp >= booking.checkInDate, "Check-in date not reached");
        
        booking.status = BookingStatus.Active;
        emit BookingConfirmed(bookingId);
    }
    
    /**
     * @dev Complete booking and release funds (called on check-out)
     */
    function completeBooking(bytes32 bookingId) external onlyOwner nonReentrant {
        Booking storage booking = bookings[bookingId];
        require(booking.status == BookingStatus.Active, "Booking not active");
        
        booking.status = BookingStatus.Completed;
        
        // Distribute funds
        if (booking.platformFee > 0) {
            hktToken.transfer(platformWallet, booking.platformFee);
        }
        
        if (booking.cleaningFee > 0) {
            hktToken.transfer(platformWallet, booking.cleaningFee);
        }
        
        uint256 ownerAmount = booking.totalAmount - booking.platformFee - booking.cleaningFee;
        if (ownerAmount > 0) {
            hktToken.transfer(propertyOwnerWallet, ownerAmount);
        }
        
        emit BookingCompleted(bookingId);
        emit FundsReleased(bookingId, booking.totalAmount);
    }
    
    /**
     * @dev Cancel booking with partial refund
     */
    function cancelBooking(bytes32 bookingId) external nonReentrant {
        Booking storage booking = bookings[bookingId];
        require(booking.booker == msg.sender, "Not booking owner");
        require(booking.status == BookingStatus.Pending, "Cannot cancel non-pending booking");
        require(block.timestamp < booking.checkInDate, "Cannot cancel after check-in date");
        
        booking.status = BookingStatus.Cancelled;
        
        // Calculate refund (50% of total amount)
        uint256 refundAmount = (booking.totalAmount * cancellationRefundPercentage) / 10000;
        uint256 platformRetention = booking.totalAmount - refundAmount;
        
        // Process refund
        if (refundAmount > 0) {
            hktToken.transfer(booking.booker, refundAmount);
        }
        
        if (platformRetention > 0) {
            hktToken.transfer(platformWallet, platformRetention);
        }
        
        // Free up the week
        weeklyAvailability[booking.propertyId][booking.weekNumber][getWeekFromTimestamp(booking.checkInDate)] = false;
        
        emit BookingCancelled(bookingId, refundAmount);
    }
    
    /**
     * @dev Get booking details
     */
    function getBooking(bytes32 bookingId) external view returns (Booking memory) {
        return bookings[bookingId];
    }
    
    /**
     * @dev Check if a week is available for booking
     */
    function isWeekAvailable(
        string memory propertyId,
        uint256 weekNumber,
        uint256 targetDate
    ) external view returns (bool) {
        return !weeklyAvailability[propertyId][weekNumber][getWeekFromTimestamp(targetDate)];
    }
    
    /**
     * @dev Convert USD amount to HKT tokens (placeholder - should use oracle)
     */
    function convertUSDToHKT(uint256 usdAmount) public pure returns (uint256) {
        // Placeholder: assuming 1 HKT = $0.10
        return usdAmount * 10 * 10**18; // Convert to wei
    }
    
    /**
     * @dev Get week number from timestamp
     */
    function getWeekFromTimestamp(uint256 timestamp) public pure returns (uint256) {
        return (timestamp / 7 days) % 52 + 1;
    }
    
    /**
     * @dev Update platform fee percentage
     */
    function setPlatformFeePercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= 2000, "Fee cannot exceed 20%"); // Maximum 20%
        platformFeePercentage = newPercentage;
    }
    
    /**
     * @dev Update cleaning fee
     */
    function setCleaningFeeUSD(uint256 newFeeUSD) external onlyOwner {
        cleaningFeeUSD = newFeeUSD;
    }
    
    /**
     * @dev Update cancellation refund percentage
     */
    function setCancellationRefundPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= 10000, "Percentage cannot exceed 100%");
        cancellationRefundPercentage = newPercentage;
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = hktToken.balanceOf(address(this));
        hktToken.transfer(owner(), balance);
    }
}