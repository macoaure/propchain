import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { WalletProvider } from '../context/WalletContext';

// Mock the WalletConnectButton component
vi.mock('../components/WalletConnect/WalletConnectButton', () => ({
  default: () => <div data-testid="wallet-connect-button">WalletConnectButton</div>,
}));

describe('Navbar', () => {
  const renderNavbar = (props = {}) => {
    return render(
      <BrowserRouter>
        <WalletProvider>
          <Navbar {...props} />
        </WalletProvider>
      </BrowserRouter>
    );
  };

  it('should render with mock wallet button when useRealWallet is false', () => {
    const mockConnectWallet = vi.fn();
    renderNavbar({
      onConnectWallet: mockConnectWallet,
      walletConnected: false,
      useRealWallet: false,
    });

    // Check for basic elements
    expect(screen.getByText('PropChain')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();

    // Check that we're using the mock wallet button
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();

    // WalletConnectButton should not be rendered
    expect(screen.queryByTestId('wallet-connect-button')).not.toBeInTheDocument();
  });

  it('should render with WalletConnectButton when useRealWallet is true', () => {
    renderNavbar({ useRealWallet: true });

    // Check for basic elements
    expect(screen.getByText('PropChain')).toBeInTheDocument();

    // WalletConnectButton should be rendered
    expect(screen.getByTestId('wallet-connect-button')).toBeInTheDocument();

    // Mock wallet button should not be rendered
    expect(screen.queryByText('Connect Wallet')).not.toBeInTheDocument();
  });

  it('should show connected state when using mock wallet and walletConnected is true', () => {
    renderNavbar({ onConnectWallet: vi.fn(), walletConnected: true, useRealWallet: false });

    // Check that we're showing connected state
    expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
  });
});
