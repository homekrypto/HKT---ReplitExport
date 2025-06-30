import { ethers } from 'ethers';

// Smart contract ABIs
const PROPERTY_NFT_ABI = [
  "function ownsPropertyWeek(address user, string memory propertyId, uint256 weekNumber) view returns (bool, uint256)",
  "function canBookForFree(address user, string memory propertyId, uint256 weekNumber) view returns (bool)",
  "function getUserShares(address user) view returns (uint256[])",
  "function getShareDetails(uint256 tokenId) view returns (tuple(string propertyId, uint256 weekNumber, uint256 yearPurchased, bool hasUsedFreeWeek, uint256 lastBookedYear, uint256 purchasePrice, string metadataURI))",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

const HKT_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function kycVerified(address user) view returns (bool)",
  "function canSend(address sender, uint256 amount) view returns (bool)"
];

const DAO_ABI = [
  "function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description) returns (uint256)",
  "function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) returns (uint256)",
  "function getProposalDetails(uint256 proposalId) view returns (tuple(uint8 proposalType, string title, string description, uint256 requestedAmount, address targetContract, bytes executionData, string[] votingOptions))",
  "function canVote(address voter, uint256 proposalId) view returns (bool)",
  "function getVotingPower(address voter, uint256 proposalId) view returns (uint256)"
];

interface PropertyShare {
  tokenId: number;
  propertyId: string;
  weekNumber: number;
  yearPurchased: number;
  hasUsedFreeWeek: boolean;
  lastBookedYear: number;
  purchasePrice: string;
  metadataURI: string;
}

interface Web3State {
  isConnected: boolean;
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
}

export class Web3NFTService {
  private static instance: Web3NFTService;
  private state: Web3State = {
    isConnected: false,
    account: null,
    provider: null,
    signer: null,
    chainId: null,
    isCorrectNetwork: false
  };

  // Contract addresses (environment variables)
  private contracts = {
    propertyNFT: import.meta.env.VITE_PROPERTY_NFT_CONTRACT || "0x0000000000000000000000000000000000000000",
    hktToken: import.meta.env.VITE_HKT_TOKEN_CONTRACT || "0x0de50324B6960B15A5ceD3D076aE314ac174Da2e",
    dao: import.meta.env.VITE_DAO_CONTRACT || "0x0000000000000000000000000000000000000000",
    bookingEscrow: import.meta.env.VITE_BOOKING_ESCROW_CONTRACT || "0x0000000000000000000000000000000000000000"
  };

  private targetChainId = parseInt(import.meta.env.VITE_TARGET_CHAIN_ID || "1"); // Ethereum mainnet
  private listeners: Set<(state: Web3State) => void> = new Set();

  static getInstance(): Web3NFTService {
    if (!Web3NFTService.instance) {
      Web3NFTService.instance = new Web3NFTService();
    }
    return Web3NFTService.instance;
  }

  /**
   * Subscribe to Web3 state changes
   */
  subscribe(listener: (state: Web3State) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Connect to MetaMask wallet
   */
  async connect(): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      this.state = {
        isConnected: true,
        account: accounts[0],
        provider,
        signer,
        chainId: Number(network.chainId),
        isCorrectNetwork: Number(network.chainId) === this.targetChainId
      };

      this.setupEventListeners();
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.state = {
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      chainId: null,
      isCorrectNetwork: false
    };
    this.notifyListeners();
  }

  /**
   * Get current Web3 state
   */
  getState(): Web3State {
    return { ...this.state };
  }

  /**
   * Get user's property NFT shares
   */
  async getUserPropertyShares(): Promise<PropertyShare[]> {
    if (!this.state.signer || !this.state.account) {
      throw new Error('Wallet not connected');
    }

    const contract = new ethers.Contract(
      this.contracts.propertyNFT,
      PROPERTY_NFT_ABI,
      this.state.signer
    );

    try {
      const tokenIds = await contract.getUserShares(this.state.account);
      const shares: PropertyShare[] = [];

      for (const tokenId of tokenIds) {
        const shareDetails = await contract.getShareDetails(tokenId);
        shares.push({
          tokenId: Number(tokenId),
          propertyId: shareDetails.propertyId,
          weekNumber: Number(shareDetails.weekNumber),
          yearPurchased: Number(shareDetails.yearPurchased),
          hasUsedFreeWeek: shareDetails.hasUsedFreeWeek,
          lastBookedYear: Number(shareDetails.lastBookedYear),
          purchasePrice: ethers.formatEther(shareDetails.purchasePrice),
          metadataURI: shareDetails.metadataURI
        });
      }

      return shares;
    } catch (error) {
      console.error('Failed to get user property shares:', error);
      return [];
    }
  }

  /**
   * Check if user owns specific property week
   */
  async checkPropertyOwnership(propertyId: string, weekNumber: number): Promise<{
    owns: boolean;
    tokenId?: number;
    canBookForFree?: boolean;
  }> {
    if (!this.state.signer || !this.state.account) {
      return { owns: false };
    }

    const contract = new ethers.Contract(
      this.contracts.propertyNFT,
      PROPERTY_NFT_ABI,
      this.state.signer
    );

    try {
      const [owns, tokenId] = await contract.ownsPropertyWeek(
        this.state.account,
        propertyId,
        weekNumber
      );

      if (owns) {
        const canBookForFree = await contract.canBookForFree(
          this.state.account,
          propertyId,
          weekNumber
        );

        return {
          owns: true,
          tokenId: Number(tokenId),
          canBookForFree
        };
      }

      return { owns: false };
    } catch (error) {
      console.error('Failed to check property ownership:', error);
      return { owns: false };
    }
  }

  /**
   * Get HKT token balance and info
   */
  async getHKTBalance(): Promise<{
    balance: string;
    formattedBalance: string;
    isKYCVerified: boolean;
    canTransact: boolean;
  }> {
    if (!this.state.signer || !this.state.account) {
      return { balance: "0", formattedBalance: "0", isKYCVerified: false, canTransact: false };
    }

    const contract = new ethers.Contract(
      this.contracts.hktToken,
      HKT_TOKEN_ABI,
      this.state.signer
    );

    try {
      const [balance, isKYCVerified] = await Promise.all([
        contract.balanceOf(this.state.account),
        contract.kycVerified(this.state.account)
      ]);

      const canSend = await contract.canSend(this.state.account, balance);

      return {
        balance: balance.toString(),
        formattedBalance: ethers.formatEther(balance),
        isKYCVerified,
        canTransact: canSend
      };
    } catch (error) {
      console.error('Failed to get HKT balance:', error);
      return { balance: "0", formattedBalance: "0", isKYCVerified: false, canTransact: false };
    }
  }

  /**
   * Transfer HKT tokens
   */
  async transferHKT(to: string, amount: string): Promise<string> {
    if (!this.state.signer) {
      throw new Error('Wallet not connected');
    }

    const contract = new ethers.Contract(
      this.contracts.hktToken,
      HKT_TOKEN_ABI,
      this.state.signer
    );

    try {
      const tx = await contract.transfer(to, ethers.parseEther(amount));
      return tx.hash;
    } catch (error) {
      console.error('Failed to transfer HKT:', error);
      throw error;
    }
  }

  /**
   * Create DAO proposal
   */
  async createProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string
  ): Promise<string> {
    if (!this.state.signer) {
      throw new Error('Wallet not connected');
    }

    const contract = new ethers.Contract(
      this.contracts.dao,
      DAO_ABI,
      this.state.signer
    );

    try {
      const tx = await contract.propose(targets, values, calldatas, description);
      return tx.hash;
    } catch (error) {
      console.error('Failed to create proposal:', error);
      throw error;
    }
  }

  /**
   * Vote on DAO proposal
   */
  async voteOnProposal(
    proposalId: number,
    support: 0 | 1 | 2, // 0=Against, 1=For, 2=Abstain
    reason: string = ""
  ): Promise<string> {
    if (!this.state.signer) {
      throw new Error('Wallet not connected');
    }

    const contract = new ethers.Contract(
      this.contracts.dao,
      DAO_ABI,
      this.state.signer
    );

    try {
      const tx = await contract.castVoteWithReason(proposalId, support, reason);
      return tx.hash;
    } catch (error) {
      console.error('Failed to vote on proposal:', error);
      throw error;
    }
  }

  /**
   * Check voting power for proposal
   */
  async getVotingPower(proposalId: number): Promise<{
    votingPower: string;
    canVote: boolean;
  }> {
    if (!this.state.signer || !this.state.account) {
      return { votingPower: "0", canVote: false };
    }

    const contract = new ethers.Contract(
      this.contracts.dao,
      DAO_ABI,
      this.state.signer
    );

    try {
      const [votingPower, canVote] = await Promise.all([
        contract.getVotingPower(this.state.account, proposalId),
        contract.canVote(this.state.account, proposalId)
      ]);

      return {
        votingPower: ethers.formatEther(votingPower),
        canVote
      };
    } catch (error) {
      console.error('Failed to get voting power:', error);
      return { votingPower: "0", canVote: false };
    }
  }

  /**
   * Switch to target network
   */
  async switchNetwork(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${this.targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        throw new Error('Please add the required network to MetaMask');
      }
      throw error;
    }
  }

  /**
   * Setup event listeners for wallet events
   */
  private setupEventListeners(): void {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.state.account = accounts[0];
        this.notifyListeners();
      }
    });

    window.ethereum.on('chainChanged', (chainId: string) => {
      this.state.chainId = parseInt(chainId, 16);
      this.state.isCorrectNetwork = this.state.chainId === this.targetChainId;
      this.notifyListeners();
    });

    window.ethereum.on('disconnect', () => {
      this.disconnect();
    });
  }

  /**
   * Check if wallet is already connected
   */
  async checkConnection(): Promise<void> {
    if (typeof window.ethereum === 'undefined') return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        this.state = {
          isConnected: true,
          account: accounts[0].address,
          provider,
          signer,
          chainId: Number(network.chainId),
          isCorrectNetwork: Number(network.chainId) === this.targetChainId
        };

        this.setupEventListeners();
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  }
}

// Export singleton instance
export const web3NFTService = Web3NFTService.getInstance();

// Auto-check connection on module load
web3NFTService.checkConnection();