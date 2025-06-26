import { useEffect, useRef } from 'react';
import { SwapWidget } from '@uniswap/widgets';
import '@uniswap/widgets/fonts.css';
import { providers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface UniswapWidgetProps {
  onTransactionComplete?: (txHash: string) => void;
}

// HKT Token contract address (placeholder - replace with actual deployed contract)
const HKT_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';
// USDC on Ethereum mainnet
const USDC_ADDRESS = '0xA0b86a33E6417c5c5aAB3297e6B26F21F3B42dBb';

export default function UniswapWidget({ onTransactionComplete }: UniswapWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetRef.current) return;

    // Check if user has MetaMask
    if (typeof window.ethereum === 'undefined') {
      widgetRef.current.innerHTML = `
        <div class="p-6 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <h3 class="text-lg font-semibold mb-2">MetaMask Required</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Please install MetaMask to purchase HKT tokens
          </p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank"
            class="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Install MetaMask
          </a>
        </div>
      `;
      return;
    }

    const provider = new providers.Web3Provider(window.ethereum);

    const widgetConfig = {
      tokenList: 'https://tokens.uniswap.org',
      provider,
      theme: {
        primary: '#667eea',
        secondary: '#764ba2',
        interactive: '#667eea',
        container: '#ffffff',
        module: '#f8fafc',
        accent: '#667eea',
        outline: '#e2e8f0',
        dialog: '#ffffff',
        fontFamily: 'Inter, sans-serif',
      },
      width: '100%',
      defaultInputToken: USDC_ADDRESS,
      defaultOutputToken: HKT_TOKEN_ADDRESS,
      defaultInputAmount: '100', // Default to $100 USDC
      onConnectWallet: () => {
        console.log('Wallet connection initiated');
      },
      onTransactionSubmitted: (txHash: string) => {
        console.log('Transaction submitted:', txHash);
        if (onTransactionComplete) {
          onTransactionComplete(txHash);
        }
      },
    };

    try {
      // Clear any existing content
      widgetRef.current.innerHTML = '';
      
      // Create the Uniswap widget
      const widgetElement = document.createElement('div');
      widgetElement.id = 'uniswap-widget';
      widgetRef.current.appendChild(widgetElement);
      
      // Initialize SwapWidget
      SwapWidget({
        ...widgetConfig,
        provider,
      }, widgetElement);
    } catch (error) {
      console.error('Failed to initialize Uniswap widget:', error);
      widgetRef.current.innerHTML = `
        <div class="p-6 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
          <h3 class="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">
            Widget Loading Error
          </h3>
          <p class="text-red-600 dark:text-red-300">
            Unable to load trading interface. Please refresh the page or try again later.
          </p>
        </div>
      `;
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = '';
      }
    };
  }, [onTransactionComplete]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div ref={widgetRef} className="min-h-[400px]" />
    </div>
  );
}