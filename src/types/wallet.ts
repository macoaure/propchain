export interface WalletInfo {
  address: string;
  chainId?: string | number;
  isConnected: boolean;
}

export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (params: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
}

export interface WalletProviderInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ConnectWalletOptions {
  provider?: EthereumProvider;
  onSuccess?: (address: string) => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
