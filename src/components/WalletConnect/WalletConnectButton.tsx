import React, { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, LogOut, Settings, ExternalLink } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import WalletConnectionModal from '../Modal/WalletConnectionModal';

/**
 * Wallet Connect Button Component
 */
const WalletConnectButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { walletInfo, getDisplayAddress, disconnectWallet } = useWallet();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    if (walletInfo.isConnected) {
      setIsMenuOpen(!isMenuOpen);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDisconnect = () => {
    disconnectWallet();
    setIsMenuOpen(false);
  };

  const openBlockExplorer = () => {
    if (walletInfo.address) {
      window.open(`https://etherscan.io/address/${walletInfo.address}`, '_blank');
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleButtonClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          walletInfo.isConnected
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            : 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:block">
          {walletInfo.isConnected ? getDisplayAddress() : 'Connect Wallet'}
        </span>
        {walletInfo.isConnected && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && walletInfo.isConnected && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
          <div className="px-4 py-3">
            <p className="text-sm text-gray-500">Connected with MetaMask</p>
            <p className="text-sm font-medium text-gray-900 truncate">{getDisplayAddress()}</p>
          </div>
          <div className="py-1">
            <button
              onClick={openBlockExplorer}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Settings className="w-4 h-4 mr-2" />
              Wallet Settings
            </button>
          </div>
          <div className="py-1">
            <button
              onClick={handleDisconnect}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              title="Opens MetaMask disconnect tutorial to properly disconnect your wallet"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect (via MetaMask)
            </button>
          </div>
        </div>
      )}

      {/* The modal will render at the document body level via createPortal */}
      <WalletConnectionModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default WalletConnectButton;
