import { Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';
import { AuthenticatedRequest } from '../auth';

// Contract ABIs (simplified for essential functions)
const PROPERTY_NFT_ABI = [
  "function ownsPropertyWeek(address user, string memory propertyId, uint256 weekNumber) view returns (bool, uint256)",
  "function canBookForFree(address user, string memory propertyId, uint256 weekNumber) view returns (bool)",
  "function getUserShares(address user) view returns (uint256[])",
  "function getShareDetails(uint256 tokenId) view returns (tuple(string propertyId, uint256 weekNumber, uint256 yearPurchased, bool hasUsedFreeWeek, uint256 lastBookedYear, uint256 purchasePrice, string metadataURI))"
];

const HKT_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function kycVerified(address user) view returns (bool)",
  "function canSend(address sender, uint256 amount) view returns (bool)",
  "function canReceive(address recipient, uint256 amount) view returns (bool)"
];

const DAO_ABI = [
  "function canVote(address voter, uint256 proposalId) view returns (bool)",
  "function getVotingPower(address voter, uint256 proposalId) view returns (uint256)"
];

interface ContractAddresses {
  propertyNFT: string;
  hktToken: string;
  dao: string;
  bookingEscrow: string;
}

// Contract addresses (should be from environment variables in production)
const CONTRACT_ADDRESSES: ContractAddresses = {
  propertyNFT: process.env.PROPERTY_NFT_CONTRACT || "0x0000000000000000000000000000000000000000",
  hktToken: process.env.HKT_TOKEN_CONTRACT || "0x0de50324B6960B15A5ceD3D076aE314ac174Da2e",
  dao: process.env.DAO_CONTRACT || "0x0000000000000000000000000000000000000000",
  bookingEscrow: process.env.BOOKING_ESCROW_CONTRACT || "0x0000000000000000000000000000000000000000"
};

// Initialize provider (using Ethereum mainnet by default)
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ETHEREUM_RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/your-key"
);

export class Web3TokenGating {
  private propertyNFTContract: ethers.Contract;
  private hktTokenContract: ethers.Contract;
  private daoContract: ethers.Contract;

  constructor() {
    this.propertyNFTContract = new ethers.Contract(
      CONTRACT_ADDRESSES.propertyNFT,
      PROPERTY_NFT_ABI,
      provider
    );
    
    this.hktTokenContract = new ethers.Contract(
      CONTRACT_ADDRESSES.hktToken,
      HKT_TOKEN_ABI,
      provider
    );
    
    this.daoContract = new ethers.Contract(
      CONTRACT_ADDRESSES.dao,
      DAO_ABI,
      provider
    );
  }

  /**
   * Check if user owns property NFT for specific week
   */
  async checkPropertyOwnership(
    walletAddress: string,
    propertyId: string,
    weekNumber?: number
  ): Promise<{
    ownsProperty: boolean;
    tokenId?: number;
    weekNumber?: number;
    canBookForFree?: boolean;
  }> {
    try {
      if (!ethers.isAddress(walletAddress)) {
        return { ownsProperty: false };
      }

      if (weekNumber) {
        // Check specific week ownership
        const [owns, tokenId] = await this.propertyNFTContract.ownsPropertyWeek(
          walletAddress,
          propertyId,
          weekNumber
        );

        if (owns) {
          const canBookForFree = await this.propertyNFTContract.canBookForFree(
            walletAddress,
            propertyId,
            weekNumber
          );

          return {
            ownsProperty: true,
            tokenId: Number(tokenId),
            weekNumber,
            canBookForFree
          };
        }
      } else {
        // Check if user owns any shares of the property
        const userShares = await this.propertyNFTContract.getUserShares(walletAddress);
        
        for (const tokenId of userShares) {
          const shareDetails = await this.propertyNFTContract.getShareDetails(tokenId);
          if (shareDetails.propertyId === propertyId) {
            return {
              ownsProperty: true,
              tokenId: Number(tokenId),
              weekNumber: Number(shareDetails.weekNumber)
            };
          }
        }
      }

      return { ownsProperty: false };
    } catch (error) {
      console.error('Error checking property ownership:', error);
      return { ownsProperty: false };
    }
  }

  /**
   * Check user's HKT token balance and KYC status
   */
  async checkHKTBalance(walletAddress: string): Promise<{
    balance: string;
    isKYCVerified: boolean;
    canTransact: boolean;
  }> {
    try {
      if (!ethers.isAddress(walletAddress)) {
        return { balance: "0", isKYCVerified: false, canTransact: false };
      }

      const [balance, isKYCVerified] = await Promise.all([
        this.hktTokenContract.balanceOf(walletAddress),
        this.hktTokenContract.kycVerified(walletAddress)
      ]);

      const canSend = await this.hktTokenContract.canSend(walletAddress, balance);

      return {
        balance: ethers.formatEther(balance),
        isKYCVerified,
        canTransact: canSend
      };
    } catch (error) {
      console.error('Error checking HKT balance:', error);
      return { balance: "0", isKYCVerified: false, canTransact: false };
    }
  }

  /**
   * Check voting power for DAO proposals
   */
  async checkVotingPower(
    walletAddress: string,
    proposalId?: number
  ): Promise<{
    votingPower: string;
    canVote: boolean;
  }> {
    try {
      if (!ethers.isAddress(walletAddress) || !proposalId) {
        return { votingPower: "0", canVote: false };
      }

      const [votingPower, canVote] = await Promise.all([
        this.daoContract.getVotingPower(walletAddress, proposalId),
        this.daoContract.canVote(walletAddress, proposalId)
      ]);

      return {
        votingPower: ethers.formatEther(votingPower),
        canVote
      };
    } catch (error) {
      console.error('Error checking voting power:', error);
      return { votingPower: "0", canVote: false };
    }
  }
}

// Singleton instance
export const web3TokenGating = new Web3TokenGating();

/**
 * Middleware to check property NFT ownership before booking
 */
export function requirePropertyOwnership(propertyId: string, weekNumber?: number) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const walletAddress = req.user?.primaryWalletAddress;
      
      if (!walletAddress) {
        return res.status(403).json({
          error: 'Wallet address required for property access',
          requiresWallet: true
        });
      }

      const ownership = await web3TokenGating.checkPropertyOwnership(
        walletAddress,
        propertyId,
        weekNumber
      );

      if (!ownership.ownsProperty) {
        return res.status(403).json({
          error: 'Property ownership required',
          propertyId,
          weekNumber,
          ownsProperty: false
        });
      }

      // Add ownership info to request
      (req as any).propertyOwnership = ownership;
      next();
    } catch (error) {
      console.error('Property ownership check failed:', error);
      res.status(500).json({ error: 'Failed to verify property ownership' });
    }
  };
}

/**
 * Middleware to check HKT token balance and KYC status
 */
export function requireHKTBalance(minimumBalance: string = "0") {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const walletAddress = req.user?.primaryWalletAddress;
      
      if (!walletAddress) {
        return res.status(403).json({
          error: 'Wallet address required for HKT access',
          requiresWallet: true
        });
      }

      const hktInfo = await web3TokenGating.checkHKTBalance(walletAddress);

      if (!hktInfo.isKYCVerified) {
        return res.status(403).json({
          error: 'KYC verification required',
          isKYCVerified: false
        });
      }

      const minBalance = ethers.parseEther(minimumBalance);
      const userBalance = ethers.parseEther(hktInfo.balance);

      if (userBalance < minBalance) {
        return res.status(403).json({
          error: 'Insufficient HKT balance',
          required: minimumBalance,
          current: hktInfo.balance
        });
      }

      // Add HKT info to request
      (req as any).hktInfo = hktInfo;
      next();
    } catch (error) {
      console.error('HKT balance check failed:', error);
      res.status(500).json({ error: 'Failed to verify HKT balance' });
    }
  };
}

/**
 * Middleware to check DAO voting power
 */
export function requireVotingPower(proposalId?: number) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const walletAddress = req.user?.primaryWalletAddress;
      const targetProposalId = proposalId || parseInt(req.params.proposalId);
      
      if (!walletAddress) {
        return res.status(403).json({
          error: 'Wallet address required for voting',
          requiresWallet: true
        });
      }

      const votingInfo = await web3TokenGating.checkVotingPower(
        walletAddress,
        targetProposalId
      );

      if (!votingInfo.canVote) {
        return res.status(403).json({
          error: 'Voting not allowed',
          proposalId: targetProposalId,
          votingPower: votingInfo.votingPower,
          canVote: false
        });
      }

      // Add voting info to request
      (req as any).votingInfo = votingInfo;
      next();
    } catch (error) {
      console.error('Voting power check failed:', error);
      res.status(500).json({ error: 'Failed to verify voting power' });
    }
  };
}

/**
 * General Web3 authentication middleware
 */
export function requireWeb3Authentication() {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const walletAddress = req.user?.primaryWalletAddress;
      
      if (!walletAddress) {
        return res.status(403).json({
          error: 'Web3 wallet connection required',
          requiresWallet: true
        });
      }

      // Basic wallet validation
      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({
          error: 'Invalid wallet address format'
        });
      }

      // Add basic Web3 info to request
      (req as any).web3 = { walletAddress };
      next();
    } catch (error) {
      console.error('Web3 authentication failed:', error);
      res.status(500).json({ error: 'Web3 authentication failed' });
    }
  };
}