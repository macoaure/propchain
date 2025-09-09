import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WalletProvider, useWallet } from '../context/WalletContext';

// Mock MetaMaskService
vi.mock('../services/MetaMaskService', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            isMetaMaskInstalled: vi.fn().mockReturnValue(true),
            connectWallet: vi.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']),
            getAccounts: vi.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']),
            onAccountsChanged: vi.fn(),
            removeAccountsChangedListener: vi.fn(),
            openDisconnectTutorial: vi.fn(),
        })),
    };
});

// Test component that uses the wallet context
const TestComponent: React.FC = () => {
    const { walletInfo, isConnecting, error, connectMetaMask, disconnectWallet, getDisplayAddress } = useWallet();

    return (
        <div>
            <div data-testid="wallet-address">{walletInfo.address}</div>
            <div data-testid="wallet-status">
                {walletInfo.isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div data-testid="wallet-display-address">{getDisplayAddress()}</div>
            <div data-testid="connecting-status">
                {isConnecting ? 'Connecting...' : 'Not connecting'}
            </div>
            {error && <div data-testid="error-message">{error}</div>}
            <button data-testid="connect-button" onClick={connectMetaMask}>
                Connect
            </button>
            <button data-testid="disconnect-button" onClick={disconnectWallet}>
                Disconnect
            </button>
        </div>
    );
};

describe('WalletContext', () => {
    const renderWithProvider = () => {
        return render(
            <WalletProvider>
                <TestComponent />
            </WalletProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with empty wallet info', () => {
        renderWithProvider();

        expect(screen.getByTestId('wallet-address').textContent).toBe('');
        expect(screen.getByTestId('wallet-status').textContent).toBe('Disconnected');
        expect(screen.getByTestId('wallet-display-address').textContent).toBe('');
    });

    it('should connect to wallet when connectMetaMask is called', async () => {
        renderWithProvider();

        // Click connect button
        await act(async () => {
            await userEvent.click(screen.getByTestId('connect-button'));
        });

        // Wait for the wallet to connect
        await waitFor(() => {
            expect(screen.getByTestId('wallet-status').textContent).toBe('Connected');
        });

        expect(screen.getByTestId('wallet-address').textContent).toBe(
            '0x1234567890123456789012345678901234567890'
        );

        expect(screen.getByTestId('wallet-display-address').textContent).toBe(
            '0x1234...7890'
        );
    });

    it('should disconnect wallet when disconnectWallet is called', async () => {
        renderWithProvider();

        // First connect
        await act(async () => {
            await userEvent.click(screen.getByTestId('connect-button'));
        });

        // Wait for connection
        await waitFor(() => {
            expect(screen.getByTestId('wallet-status').textContent).toBe('Connected');
        });

        // Then disconnect
        await act(async () => {
            await userEvent.click(screen.getByTestId('disconnect-button'));
        });

        // Check that wallet is disconnected
        expect(screen.getByTestId('wallet-status').textContent).toBe('Disconnected');
        expect(screen.getByTestId('wallet-address').textContent).toBe('');
        expect(screen.getByTestId('wallet-display-address').textContent).toBe('');
    });
});
