// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title HKTSecurityToken
 * @dev ERC-1400 compatible security token for HKT
 * Includes compliance features, transfer restrictions, and regulatory controls
 */
contract HKTSecurityToken is ERC20, Ownable, Pausable {
    
    // KYC and compliance mappings
    mapping(address => bool) public kycVerified;
    mapping(address => bool) public accreditedInvestors;
    mapping(address => uint256) public holdingPeriodStart;
    mapping(address => bool) public transferRestricted;
    
    // Token economics
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion HKT
    uint256 public stakingPool;
    uint256 public yieldDistributionPool;
    
    // Compliance settings
    uint256 public minimumHoldingPeriod = 365 days; // 1 year lock for securities compliance
    bool public transfersEnabled = true;
    
    // Events for compliance tracking
    event KYCStatusUpdated(address indexed user, bool verified);
    event AccreditedInvestorStatusUpdated(address indexed user, bool accredited);
    event TransferRestrictionUpdated(address indexed user, bool restricted);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event YieldDistributed(address indexed recipient, uint256 amount);

    constructor() ERC20("Home Krypto Token", "HKT") {
        // Mint initial supply to contract deployer
        _mint(msg.sender, MAX_SUPPLY);
        stakingPool = 0;
        yieldDistributionPool = 0;
    }

    /**
     * @dev Set KYC status for an address
     */
    function setKYCStatus(address user, bool verified) external onlyOwner {
        kycVerified[user] = verified;
        emit KYCStatusUpdated(user, verified);
    }

    /**
     * @dev Set accredited investor status
     */
    function setAccreditedInvestor(address user, bool accredited) external onlyOwner {
        accreditedInvestors[user] = accredited;
        emit AccreditedInvestorStatusUpdated(user, accredited);
    }

    /**
     * @dev Set transfer restriction for an address
     */
    function setTransferRestriction(address user, bool restricted) external onlyOwner {
        transferRestricted[user] = restricted;
        emit TransferRestrictionUpdated(user, restricted);
    }

    /**
     * @dev Enable or disable all transfers (emergency function)
     */
    function setTransfersEnabled(bool enabled) external onlyOwner {
        transfersEnabled = enabled;
    }

    /**
     * @dev Set minimum holding period for compliance
     */
    function setMinimumHoldingPeriod(uint256 period) external onlyOwner {
        minimumHoldingPeriod = period;
    }

    /**
     * @dev Stake HKT tokens to earn yield
     */
    function stakeTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(kycVerified[msg.sender], "KYC verification required");

        _transfer(msg.sender, address(this), amount);
        stakingPool += amount;
        
        emit TokensStaked(msg.sender, amount);
    }

    /**
     * @dev Unstake HKT tokens (with holding period check)
     */
    function unstakeTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(stakingPool >= amount, "Insufficient staking pool");
        require(
            block.timestamp >= holdingPeriodStart[msg.sender] + minimumHoldingPeriod,
            "Minimum holding period not met"
        );

        stakingPool -= amount;
        _transfer(address(this), msg.sender, amount);
        
        emit TokensUnstaked(msg.sender, amount);
    }

    /**
     * @dev Distribute yield to token holders
     */
    function distributeYield(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(kycVerified[recipients[i]], "Recipient not KYC verified");
            _mint(recipients[i], amounts[i]);
            emit YieldDistributed(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Override transfer function to implement compliance checks
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);

        // Skip checks for minting and burning
        if (from == address(0) || to == address(0)) {
            return;
        }

        require(!paused(), "Token transfers are paused");
        require(transfersEnabled, "Transfers are currently disabled");
        require(!transferRestricted[from], "Sender is transfer restricted");
        require(!transferRestricted[to], "Recipient is transfer restricted");
        require(kycVerified[from], "Sender not KYC verified");
        require(kycVerified[to], "Recipient not KYC verified");

        // Check holding period for securities compliance
        if (holdingPeriodStart[from] != 0) {
            require(
                block.timestamp >= holdingPeriodStart[from] + minimumHoldingPeriod,
                "Minimum holding period not met"
            );
        }

        // Set holding period start for new holders
        if (holdingPeriodStart[to] == 0 && balanceOf(to) == 0) {
            holdingPeriodStart[to] = block.timestamp;
        }
    }

    /**
     * @dev Check if an address can receive tokens (compliance check)
     */
    function canReceive(address recipient, uint256 amount) external view returns (bool) {
        if (paused() || !transfersEnabled) return false;
        if (transferRestricted[recipient]) return false;
        if (!kycVerified[recipient]) return false;
        return true;
    }

    /**
     * @dev Check if an address can send tokens (compliance check)
     */
    function canSend(address sender, uint256 amount) external view returns (bool) {
        if (paused() || !transfersEnabled) return false;
        if (transferRestricted[sender]) return false;
        if (!kycVerified[sender]) return false;
        if (balanceOf(sender) < amount) return false;
        
        // Check holding period
        if (holdingPeriodStart[sender] != 0) {
            return block.timestamp >= holdingPeriodStart[sender] + minimumHoldingPeriod;
        }
        
        return true;
    }

    /**
     * @dev Get user's staking info
     */
    function getStakingInfo(address user) external view returns (
        uint256 balance,
        uint256 holdingPeriodRemaining,
        bool canUnstake
    ) {
        balance = balanceOf(user);
        
        if (holdingPeriodStart[user] == 0) {
            holdingPeriodRemaining = minimumHoldingPeriod;
            canUnstake = false;
        } else {
            uint256 elapsed = block.timestamp - holdingPeriodStart[user];
            if (elapsed >= minimumHoldingPeriod) {
                holdingPeriodRemaining = 0;
                canUnstake = true;
            } else {
                holdingPeriodRemaining = minimumHoldingPeriod - elapsed;
                canUnstake = false;
            }
        }
    }

    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get total staking pool size
     */
    function getTotalStaked() external view returns (uint256) {
        return stakingPool;
    }

    /**
     * @dev Get yield distribution pool size
     */
    function getYieldPool() external view returns (uint256) {
        return yieldDistributionPool;
    }
}