import { EthereumProvider, ConnectWalletOptions } from '../types/wallet';

class WalletConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletConnectionError';
  }
}

/**
 * MetaMask wallet service class - follows Single Responsibility Principle
 * Responsible only for managing MetaMask wallet connections
 */
export class MetaMaskService {
  private ethereum: EthereumProvider | undefined;

  constructor(provider?: EthereumProvider) {
    // Use injected provider or the provided one (useful for testing)
    this.ethereum = provider || window.ethereum;
  }

  /**
   * Check if MetaMask is installed
   */
  public isMetaMaskInstalled(): boolean {
    return !!this.ethereum?.isMetaMask;
  }

  /**
   * Get MetaMask download URL
   */
  public getMetaMaskDownloadUrl(): string {
    return 'https://metamask.io/download/';
  }

  /**
   * Request connection to MetaMask wallet
   */
  public async connectWallet(options?: ConnectWalletOptions): Promise<string[]> {
    if (!this.isMetaMaskInstalled()) {
      const error = new WalletConnectionError('MetaMask is not installed');
      if (options?.onError) {
        options.onError(error);
      }
      throw error;
    }

    try {
      const provider = options?.provider || this.ethereum;
      if (!provider) {
        throw new WalletConnectionError('No Ethereum provider found');
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new WalletConnectionError('No accounts found');
      }

      if (options?.onSuccess) {
        options.onSuccess(accounts[0]);
      }

      return accounts;
    } catch (error: any) {
      const connectionError = new WalletConnectionError(
        error.message || 'Failed to connect to MetaMask'
      );

      if (options?.onError) {
        options.onError(connectionError);
      }

      throw connectionError;
    }
  }

  /**
   * Get currently connected accounts
   */
  public async getAccounts(): Promise<string[]> {
    if (!this.isMetaMaskInstalled()) {
      throw new WalletConnectionError('MetaMask is not installed');
    }

    try {
      const accounts = await this.ethereum?.request({
        method: 'eth_accounts',
      });

      return accounts || [];
    } catch (error: any) {
      throw new WalletConnectionError(
        error.message || 'Failed to get accounts'
      );
    }
  }

  /**
   * Listen for account changes
   */
  public onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (this.ethereum) {
      this.ethereum.on('accountsChanged', callback);
    }
  }

  /**
   * Remove account change listener
   */
  public removeAccountsChangedListener(callback: (accounts: string[]) => void): void {
    if (this.ethereum) {
      this.ethereum.removeListener('accountsChanged', callback);
    }
  }

  /**
   * Open MetaMask disconnect tutorial
   * This helps users properly disconnect their wallet from the dApp
   */
  public openDisconnectTutorial(): void {
    window.open('https://support.metamask.io/more-web3/dapps/disconnect-wallet-from-a-dapp/', '_blank');
  }
}

export default MetaMaskService;
