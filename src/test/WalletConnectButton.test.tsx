import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletConnectButton from '../components/WalletConnect/WalletConnectButton';
import { WalletProvider } from '../context/WalletContext';

// Mock useWallet hook
vi.mock('../context/WalletContext', () => {
  const actual = vi.importActual('../context/WalletContext');
  return {
    ...actual,
    useWallet: vi.fn(),
  };
});

// Mock WalletConnectionModal
vi.mock('../components/Modal/WalletConnectionModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="mock-modal">
        Modal Content<button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('WalletConnectButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderButton = (walletConnected = false) => {
    const mockDisconnectWallet = vi.fn();
    const mockConnectMetaMask = vi.fn();
    const mockGetDisplayAddress = vi.fn().mockReturnValue('0x1234...5678');

    // Mock the useWallet hook
    const { useWallet } = require('../context/WalletContext');
    useWallet.mockReturnValue({
      walletInfo: {
        address: walletConnected ? '0x1234567890123456789012345678901234567890' : '',
        isConnected: walletConnected,
      },
      isConnecting: false,
      error: null,
      connectMetaMask: mockConnectMetaMask,
      disconnectWallet: mockDisconnectWallet,
      getDisplayAddress: mockGetDisplayAddress,
    });

    return {
      mockDisconnectWallet,
      mockConnectMetaMask,
      mockGetDisplayAddress,
      ...render(
        <WalletProvider>
          <WalletConnectButton />
        </WalletProvider>
      ),
    };
  };

  it('should render Connect Wallet button when not connected', () => {
    renderButton(false);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('should render wallet address when connected', () => {
    renderButton(true);
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
  });

  it('should open modal when button is clicked and not connected', async () => {
    renderButton(false);

    // Click the button
    await userEvent.click(screen.getByText('Connect Wallet'));

    // Modal should be open
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  it('should toggle dropdown menu when button is clicked and connected', async () => {
    renderButton(true);

    // Initially dropdown should not be visible
    expect(screen.queryByText('View on Explorer')).not.toBeInTheDocument();

    // Click the button to open dropdown
    await userEvent.click(screen.getByText('0x1234...5678'));

    // Dropdown should be visible
    expect(screen.getByText('Connected with MetaMask')).toBeInTheDocument();
    expect(screen.getByText('View on Explorer')).toBeInTheDocument();
    expect(screen.getByText('Wallet Settings')).toBeInTheDocument();
    expect(screen.getByText('Disconnect')).toBeInTheDocument();

    // Click again to close dropdown
    await userEvent.click(screen.getByText('0x1234...5678'));

    // Dropdown should not be visible
    expect(screen.queryByText('View on Explorer')).not.toBeInTheDocument();
  });

  it('should call disconnectWallet when Disconnect is clicked', async () => {
    const { mockDisconnectWallet } = renderButton(true);

    // Open dropdown
    await userEvent.click(screen.getByText('0x1234...5678'));

    // Click disconnect
    await userEvent.click(screen.getByText('Disconnect'));

    // Should call disconnectWallet
    expect(mockDisconnectWallet).toHaveBeenCalledTimes(1);
  });

  it('should open modal when Wallet Settings is clicked', async () => {
    renderButton(true);

    // Open dropdown
    await userEvent.click(screen.getByText('0x1234...5678'));

    // Click wallet settings
    await userEvent.click(screen.getByText('Wallet Settings'));

    // Modal should be open
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  // Test that clicking outside closes the dropdown
  it('should close dropdown when clicking outside', async () => {
    renderButton(true);

    // Open dropdown
    await userEvent.click(screen.getByText('0x1234...5678'));

    // Dropdown should be visible
    expect(screen.getByText('View on Explorer')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    // Dropdown should not be visible
    expect(screen.queryByText('View on Explorer')).not.toBeInTheDocument();
  });
});
