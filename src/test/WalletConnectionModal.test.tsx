import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletConnectionModal from '../components/Modal/WalletConnectionModal';
import { WalletProvider } from '../context/WalletContext';

// Mock the useWallet hook
vi.mock('../context/WalletContext', () => {
    const actualContext = vi.importActual('../context/WalletContext');
    return {
        ...actualContext,
        useWallet: vi.fn().mockReturnValue({
            walletInfo: { address: '', isConnected: false },
            isConnecting: false,
            error: null,
            connectMetaMask: vi.fn(),
            disconnectWallet: vi.fn(),
            getDisplayAddress: vi.fn().mockReturnValue(''),
        }),
    };
});

// Mock MetaMaskService
vi.mock('../services/MetaMaskService', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            isMetaMaskInstalled: vi.fn().mockReturnValue(true),
            getMetaMaskDownloadUrl: vi.fn().mockReturnValue('https://metamask.io/download/'),
        })),
    };
});

describe('WalletConnectionModal', () => {
    const renderModal = (isOpen = true) => {
        const onClose = vi.fn();

        return {
            onClose,
            ...render(
                <WalletProvider>
                    <WalletConnectionModal isOpen={isOpen} onClose={onClose} />
                </WalletProvider>
            ),
        };
    };

    it('should not render when isOpen is false', () => {
        renderModal(false);
        expect(screen.queryByText('Connect Your Wallet')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
        renderModal();
        expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
        expect(screen.getByText('MetaMask')).toBeInTheDocument();
    });

    it('should show MetaMask option when MetaMask is installed', async () => {
        const { useWallet } = await import('../context/WalletContext');
        (useWallet as any).mockReturnValue({
            walletInfo: { address: '', isConnected: false },
            isConnecting: false,
            error: null,
            connectMetaMask: vi.fn(),
            disconnectWallet: vi.fn(),
            getDisplayAddress: vi.fn().mockReturnValue(''),
        });

        const { MetaMaskService } = await import('../services/MetaMaskService');
        (MetaMaskService as any).mockImplementation(() => ({
            isMetaMaskInstalled: vi.fn().mockReturnValue(true),
            getMetaMaskDownloadUrl: vi.fn().mockReturnValue('https://metamask.io/download/'),
        }));

        renderModal();
        expect(screen.getByText('MetaMask')).toBeInTheDocument();
        expect(screen.getByText('Connect to your MetaMask wallet')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        const { onClose } = renderModal();
        const closeButton = screen.getByRole('button', { name: /close/i });
        await userEvent.click(closeButton);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should show connecting spinner when isConnecting is true', async () => {
        const { useWallet } = await import('../context/WalletContext');
        (useWallet as any).mockReturnValue({
            walletInfo: { address: '', isConnected: false },
            isConnecting: true,
            error: null,
            connectMetaMask: vi.fn(),
            disconnectWallet: vi.fn(),
            getDisplayAddress: vi.fn().mockReturnValue(''),
        });

        renderModal();
        expect(screen.getByText('MetaMask')).toBeInTheDocument();
        const spinnerElement = document.querySelector('.animate-spin');
        expect(spinnerElement).toBeInTheDocument();
    });

    it('should show connected wallet info when wallet is connected', async () => {
        const mockDisconnectWallet = vi.fn();
        const { useWallet } = await import('../context/WalletContext');
        (useWallet as any).mockReturnValue({
            walletInfo: {
                address: '0x1234567890123456789012345678901234567890',
                isConnected: true,
            },
            isConnecting: false,
            error: null,
            connectMetaMask: vi.fn(),
            disconnectWallet: mockDisconnectWallet,
            getDisplayAddress: vi.fn().mockReturnValue('0x1234...7890'),
        });

        renderModal();
        expect(screen.getByText('Wallet Connected')).toBeInTheDocument();
        expect(screen.getByText('0x1234567890123456789012345678901234567890')).toBeInTheDocument();

        // Check for disconnect button
        expect(screen.getByText('Disconnect Wallet')).toBeInTheDocument();
    });

    it('should call disconnectWallet when disconnect button is clicked', async () => {
        const mockDisconnectWallet = vi.fn();
        const mockOnClose = vi.fn();

        const { useWallet } = await import('../context/WalletContext');
        (useWallet as any).mockReturnValue({
            walletInfo: {
                address: '0x1234567890123456789012345678901234567890',
                isConnected: true,
            },
            isConnecting: false,
            error: null,
            connectMetaMask: vi.fn(),
            disconnectWallet: mockDisconnectWallet,
            getDisplayAddress: vi.fn().mockReturnValue('0x1234...7890'),
        });

        render(
            <WalletProvider>
                <WalletConnectionModal isOpen={true} onClose={mockOnClose} />
            </WalletProvider>
        );

        // Click disconnect button
        await userEvent.click(screen.getByText('Disconnect Wallet'));

        // Verify disconnect and close were called
        expect(mockDisconnectWallet).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    }); it('should show error message when error is present', async () => {
        const { useWallet } = await import('../context/WalletContext');
        (useWallet as any).mockReturnValue({
            walletInfo: { address: '', isConnected: false },
            isConnecting: false,
            error: 'Failed to connect to MetaMask',
            connectMetaMask: vi.fn(),
            disconnectWallet: vi.fn(),
            getDisplayAddress: vi.fn().mockReturnValue(''),
        });

        renderModal();
        expect(screen.getByText('Failed to connect to MetaMask')).toBeInTheDocument();
    });
});
