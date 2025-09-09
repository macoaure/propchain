import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WalletInfo } from '../types/wallet';
import MetaMaskService from '../services/MetaMaskService';

interface WalletContextProps {
  walletInfo: WalletInfo;
  isConnecting: boolean;
  error: string | null;
  connectMetaMask: () => Promise<void>;
  disconnectWallet: () => void;
  getDisplayAddress: () => string;
}

const initialWalletInfo: WalletInfo = {
  address: '',
  isConnected: false,
};

const WalletContext = createContext<WalletContextProps>({
  walletInfo: initialWalletInfo,
  isConnecting: false,
  error: null,
  connectMetaMask: async () => {},
  disconnectWallet: () => {},
  getDisplayAddress: () => '',
});

/**
 * Custom hook to use wallet context
 */
export const useWallet = () => useContext(WalletContext);

/**
 * Wallet Provider component
 */
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(initialWalletInfo);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the service
  const metaMaskService = new MetaMaskService();

  /**
   * Format wallet address for display (0x1234...5678)
   */
  const getDisplayAddress = useCallback(() => {
    const address = walletInfo.address;
    if (!address) return '';

    return address.length > 10
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : address;
  }, [walletInfo.address]);

  /**
   * Connect to MetaMask wallet
   */
  const connectMetaMask = useCallback(async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await metaMaskService.connectWallet();

      if (accounts && accounts.length > 0) {
        setWalletInfo({
          address: accounts[0],
          isConnected: true,
        });
      }
    } catch (error: any) {
      setError(error.message || 'Failed to connect to wallet');
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  /**
   * Disconnect wallet
   * This both resets the local state and opens the MetaMask disconnect tutorial
   */
  const disconnectWallet = useCallback(() => {
    // Reset local state
    setWalletInfo(initialWalletInfo);
    setError(null);

    // Open MetaMask disconnect tutorial to help user properly disconnect
    metaMaskService.openDisconnectTutorial();
  }, [metaMaskService]);

  /**
   * Check if already connected on mount
   */
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const accounts = await metaMaskService.getAccounts();
        if (accounts && accounts.length > 0) {
          setWalletInfo({
            address: accounts[0],
            isConnected: true,
          });
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    if (metaMaskService.isMetaMaskInstalled()) {
      checkConnection();
    }
  }, []);

  /**
   * Listen for account changes
   */
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else {
        // Account changed
        setWalletInfo({
          address: accounts[0],
          isConnected: true,
        });
      }
    };

    if (metaMaskService.isMetaMaskInstalled()) {
      metaMaskService.onAccountsChanged(handleAccountsChanged);
    }

    return () => {
      if (metaMaskService.isMetaMaskInstalled()) {
        metaMaskService.removeAccountsChangedListener(handleAccountsChanged);
      }
    };
  }, [disconnectWallet]);

  const contextValue = {
    walletInfo,
    isConnecting,
    error,
    connectMetaMask,
    disconnectWallet,
    getDisplayAddress,
  };

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>;
};

export default WalletContext;
