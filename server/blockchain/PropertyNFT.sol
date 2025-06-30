// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PropertyNFT
 * @dev NFT contract for HKT property ownership shares
 * Each NFT represents ownership of a specific week in a specific property
 */
contract PropertyNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct PropertyShare {
        string propertyId;          // e.g., "cap-cana-villa"
        uint256 weekNumber;         // Week 1-52
        uint256 yearPurchased;      // Year when NFT was minted
        bool hasUsedFreeWeek;       // Track if free week has been used this year
        uint256 lastBookedYear;     // Last year this NFT was used for booking
        uint256 purchasePrice;      // Price paid in HKT tokens
        string metadataURI;         // IPFS URI for extended metadata
    }

    mapping(uint256 => PropertyShare) public propertyShares;
    mapping(string => mapping(uint256 => uint256)) public propertyWeekToTokenId;
    mapping(address => uint256[]) public userOwnedShares;

    event PropertyShareMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string propertyId,
        uint256 weekNumber,
        uint256 purchasePrice
    );

    event FreeWeekUsed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 year
    );

    constructor() ERC721("HKT Property Shares", "HKTPS") {}

    /**
     * @dev Mint a new property share NFT
     */
    function mintPropertyShare(
        address to,
        string memory propertyId,
        uint256 weekNumber,
        uint256 purchasePrice,
        string memory metadataURI
    ) public onlyOwner returns (uint256) {
        require(weekNumber >= 1 && weekNumber <= 52, "Invalid week number");
        require(
            propertyWeekToTokenId[propertyId][weekNumber] == 0,
            "Week already owned"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        propertyShares[tokenId] = PropertyShare({
            propertyId: propertyId,
            weekNumber: weekNumber,
            yearPurchased: block.timestamp / 365 days + 1970, // Convert to year
            hasUsedFreeWeek: false,
            lastBookedYear: 0,
            purchasePrice: purchasePrice,
            metadataURI: metadataURI
        });

        propertyWeekToTokenId[propertyId][weekNumber] = tokenId;
        userOwnedShares[to].push(tokenId);

        emit PropertyShareMinted(tokenId, to, propertyId, weekNumber, purchasePrice);
        return tokenId;
    }

    /**
     * @dev Check if user owns a specific property week
     */
    function ownsPropertyWeek(
        address user,
        string memory propertyId,
        uint256 weekNumber
    ) public view returns (bool, uint256) {
        uint256 tokenId = propertyWeekToTokenId[propertyId][weekNumber];
        if (tokenId == 0) return (false, 0);
        
        return (ownerOf(tokenId) == user, tokenId);
    }

    /**
     * @dev Check if user can book for free (owns share and hasn't used free week this year)
     */
    function canBookForFree(
        address user,
        string memory propertyId,
        uint256 weekNumber
    ) public view returns (bool) {
        (bool owns, uint256 tokenId) = ownsPropertyWeek(user, propertyId, weekNumber);
        if (!owns) return false;

        PropertyShare memory share = propertyShares[tokenId];
        uint256 currentYear = block.timestamp / 365 days + 1970;
        
        return share.lastBookedYear != currentYear;
    }

    /**
     * @dev Mark free week as used
     */
    function markFreeWeekUsed(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        
        uint256 currentYear = block.timestamp / 365 days + 1970;
        propertyShares[tokenId].lastBookedYear = currentYear;
        propertyShares[tokenId].hasUsedFreeWeek = true;

        emit FreeWeekUsed(tokenId, ownerOf(tokenId), currentYear);
    }

    /**
     * @dev Get all property shares owned by user
     */
    function getUserShares(address user) public view returns (uint256[] memory) {
        return userOwnedShares[user];
    }

    /**
     * @dev Get property share details
     */
    function getShareDetails(uint256 tokenId) public view returns (PropertyShare memory) {
        require(_exists(tokenId), "Token does not exist");
        return propertyShares[tokenId];
    }

    /**
     * @dev Override transfer to update user ownership tracking
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        if (from != address(0)) {
            // Remove from old owner's list
            uint256[] storage fromShares = userOwnedShares[from];
            for (uint256 i = 0; i < fromShares.length; i++) {
                if (fromShares[i] == tokenId) {
                    fromShares[i] = fromShares[fromShares.length - 1];
                    fromShares.pop();
                    break;
                }
            }
        }

        if (to != address(0)) {
            // Add to new owner's list
            userOwnedShares[to].push(tokenId);
        }
    }

    // Override required by Solidity for multiple inheritance
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}