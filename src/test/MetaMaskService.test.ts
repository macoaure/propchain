import { describe, it, expect, vi, beforeEach } from 'vitest';
import MetaMaskService from '../services/MetaMaskService';
import { EthereumProvider } from '../types/wallet';

// Mock EthereumProvider for testing
const createMockProvider = (options: {
  isMetaMask?: boolean;
  accountsResult?: string[];
  shouldThrow?: boolean;
}): EthereumProvider => {
  return {
    isMetaMask: options.isMetaMask !== undefined ? options.isMetaMask : true,
    request: vi.fn().mockImplementation(async ({ method }) => {
      if (options.shouldThrow) {
        throw new Error('Provider error');
      }
      if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
        return options.accountsResult || [];
      }
      return null;
    }),
    on: vi.fn(),
    removeListener: vi.fn(),
  };
};

describe('MetaMaskService', () => {
  let service: MetaMaskService;
  let mockProvider: EthereumProvider;

  beforeEach(() => {
    // Create a fresh mock provider for each test
    mockProvider = createMockProvider({
      accountsResult: ['0xabc123...'],
    });
    service = new MetaMaskService(mockProvider);
  });

  describe('isMetaMaskInstalled', () => {
    it('should return true when MetaMask is installed', () => {
      expect(service.isMetaMaskInstalled()).toBe(true);
    });

    it('should return false when MetaMask is not installed', () => {
      const noMetaMaskProvider = createMockProvider({ isMetaMask: false });
      const noMetaMaskService = new MetaMaskService(noMetaMaskProvider);
      expect(noMetaMaskService.isMetaMaskInstalled()).toBe(false);
    });

    it('should return false when provider is undefined', () => {
      const noProviderService = new MetaMaskService(undefined);
      expect(noProviderService.isMetaMaskInstalled()).toBe(false);
    });
  });

  describe('connectWallet', () => {
    it('should connect successfully and return accounts', async () => {
      const accounts = await service.connectWallet();
      expect(mockProvider.request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
      expect(accounts).toEqual(['0xabc123...']);
    });

    it('should call onSuccess callback when connection is successful', async () => {
      const onSuccess = vi.fn();
      await service.connectWallet({ onSuccess });
      expect(onSuccess).toHaveBeenCalledWith('0xabc123...');
    });

    it('should throw an error when MetaMask is not installed', async () => {
      const noMetaMaskProvider = createMockProvider({ isMetaMask: false });
      const noMetaMaskService = new MetaMaskService(noMetaMaskProvider);

      const onError = vi.fn();
      await expect(noMetaMaskService.connectWallet({ onError })).rejects.toThrow(
        'MetaMask is not installed'
      );

      expect(onError).toHaveBeenCalled();
    });

    it('should throw an error when provider throws', async () => {
      const errorProvider = createMockProvider({ shouldThrow: true });
      const errorService = new MetaMaskService(errorProvider);

      const onError = vi.fn();
      await expect(errorService.connectWallet({ onError })).rejects.toThrow('Provider error');

      expect(onError).toHaveBeenCalled();
    });

    it('should throw an error when no accounts are returned', async () => {
      const emptyAccountsProvider = createMockProvider({ accountsResult: [] });
      const emptyAccountsService = new MetaMaskService(emptyAccountsProvider);

      const onError = vi.fn();
      await expect(emptyAccountsService.connectWallet({ onError })).rejects.toThrow(
        'No accounts found'
      );

      expect(onError).toHaveBeenCalled();
    });
  });

  describe('getAccounts', () => {
    it('should return accounts when MetaMask is installed', async () => {
      const accounts = await service.getAccounts();
      expect(mockProvider.request).toHaveBeenCalledWith({ method: 'eth_accounts' });
      expect(accounts).toEqual(['0xabc123...']);
    });

    it('should throw when MetaMask is not installed', async () => {
      const noMetaMaskProvider = createMockProvider({ isMetaMask: false });
      const noMetaMaskService = new MetaMaskService(noMetaMaskProvider);

      await expect(noMetaMaskService.getAccounts()).rejects.toThrow('MetaMask is not installed');
    });

    it('should throw when provider throws', async () => {
      const errorProvider = createMockProvider({ shouldThrow: true });
      const errorService = new MetaMaskService(errorProvider);

      await expect(errorService.getAccounts()).rejects.toThrow('Provider error');
    });
  });

  describe('event listeners', () => {
    it('should set up account change listener', () => {
      const callback = vi.fn();
      service.onAccountsChanged(callback);

      expect(mockProvider.on).toHaveBeenCalledWith('accountsChanged', callback);
    });

    it('should remove account change listener', () => {
      const callback = vi.fn();
      service.removeAccountsChangedListener(callback);

      expect(mockProvider.removeListener).toHaveBeenCalledWith('accountsChanged', callback);
    });
  });

  describe('openDisconnectTutorial', () => {
    let originalWindowOpen: typeof window.open;

    beforeEach(() => {
      // Save original window.open
      originalWindowOpen = window.open;
      // Mock window.open
      window.open = vi.fn();
    });

    afterEach(() => {
      // Restore original window.open
      window.open = originalWindowOpen;
    });

    it('should open MetaMask disconnect tutorial in a new tab', () => {
      // Act
      service.openDisconnectTutorial();

      // Assert
      expect(window.open).toHaveBeenCalledWith(
        'https://support.metamask.io/more-web3/dapps/disconnect-wallet-from-a-dapp/',
        '_blank'
      );
    });
  });
});
