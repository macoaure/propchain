import React from 'react';
import Modal from './Modal';
import { useWallet } from '../../context/WalletContext';
import MetaMaskService from '../../services/MetaMaskService';

// SVG for MetaMask icon
const METAMASK_ICON = `
<svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M444.18 149.214L272.865 231.847L291.598 164.384L444.18 149.214Z" fill="#E2761B" stroke="#E2761B" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M67.82 149.214L238.498 232.566L220.402 164.384L67.82 149.214Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M387.637 336.047L344.961 402.945L437.599 429.475L464.266 337.158L387.637 336.047Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M47.7764 337.158L74.3706 429.475L167.008 402.945L124.332 336.047L47.7764 337.158Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M161.832 220.632L145.551 260.133L237.671 264.511L234.176 166.917L161.832 220.632Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M350.168 220.632L277.169 166.198L274.329 264.511L366.386 260.133L350.168 220.632Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M167.008 402.945L231.799 375.945L176.621 337.693L167.008 402.945Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M280.201 375.945L344.961 402.945L335.379 337.693L280.201 375.945Z" fill="#E4761B" stroke="#E4761B" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M344.961 402.945L280.201 375.945L284.744 412.562L284.167 428.681L344.961 402.945Z" fill="#D7C1B3" stroke="#D7C1B3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M167.008 402.945L227.801 428.681L227.256 412.562L231.799 375.945L167.008 402.945Z" fill="#D7C1B3" stroke="#D7C1B3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Wallet Connection Modal Component
 */
const WalletConnectionModal: React.FC<WalletConnectionModalProps> = ({ isOpen, onClose }) => {
  const { walletInfo, isConnecting, error, connectMetaMask, disconnectWallet } = useWallet();
  const metaMaskService = new MetaMaskService();
  const isMetaMaskInstalled = metaMaskService.isMetaMaskInstalled();

  const handleConnect = async () => {
    await connectMetaMask();
    if (walletInfo.isConnected) {
      onClose();
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Your Wallet">
      {walletInfo.isConnected ? (
        <div className="text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <div className="text-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900">Wallet Connected</h3>

            <div className="bg-gray-100 rounded-lg p-3 break-all text-sm w-full">
              <p className="font-mono">{walletInfo.address}</p>
            </div>

            <div className="flex flex-col w-full space-y-3">
              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
            <p className="text-sm">
              <strong>Important:</strong> To disconnect from this dApp later, you'll need to use
              MetaMask directly. When clicking "Disconnect", you'll be redirected to MetaMask's
              instructions.
            </p>
          </div>

          <div className="space-y-4">
            <div
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={isMetaMaskInstalled ? handleConnect : undefined}
            >
              <div className="flex items-center">
                <div className="mr-4" dangerouslySetInnerHTML={{ __html: METAMASK_ICON }} />
                <div className="flex-1">
                  <h3 className="font-medium">MetaMask</h3>
                  <p className="text-sm text-gray-500">Connect to your MetaMask wallet</p>
                </div>
                {isConnecting ? (
                  <div className="animate-spin w-5 h-5 border-b-2 border-blue-600 rounded-full"></div>
                ) : (
                  <div className="text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {!isMetaMaskInstalled && (
              <div className="mt-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800">MetaMask not detected</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please install MetaMask to connect your wallet.
                  </p>
                  <a
                    href={metaMaskService.getMetaMaskDownloadUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Install MetaMask
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default WalletConnectionModal;
