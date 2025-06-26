import { HKT_CONFIG } from './constants';

export interface Web3State {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  private state: Web3State = {
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
  };

  private listeners: Array<(state: Web3State) => void> = [];

  constructor() {
    this.checkConnection();
    this.setupEventListeners();
  }

  async checkConnection(): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          this.state.address = accounts[0];
          this.state.isConnected = true;
          await this.updateChainId();
          await this.updateBalance();
          this.notifyListeners();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  }

  async connectWallet(): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        this.state.address = accounts[0];
        this.state.isConnected = true;
        await this.updateChainId();
        await this.updateBalance();
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    this.state = {
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
    };
    this.notifyListeners();
  }

  private async updateChainId(): Promise<void> {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.state.chainId = parseInt(chainId, 16);
    } catch (error) {
      console.error('Error getting chain ID:', error);
    }
  }

  private async updateBalance(): Promise<void> {
    if (!this.state.address) return;

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [this.state.address, 'latest'],
      });
      this.state.balance = (parseInt(balance, 16) / 1e18).toFixed(4);
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  }

  private setupEventListeners(): void {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          this.disconnectWallet();
        } else {
          this.state.address = accounts[0];
          this.updateBalance();
          this.notifyListeners();
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        this.state.chainId = parseInt(chainId, 16);
        this.notifyListeners();
      });
    }
  }

  getState(): Web3State {
    return { ...this.state };
  }

  subscribe(listener: (state: Web3State) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  async switchToEthereum(): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Ethereum mainnet
      });
    } catch (error) {
      console.error('Error switching to Ethereum:', error);
      throw error;
    }
  }

  getUniswapUrl(): string {
    return `${HKT_CONFIG.UNISWAP_URL}?outputCurrency=${HKT_CONFIG.CONTRACT_ADDRESS}`;
  }
}

export const web3Service = new Web3Service();
