import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

interface RequireWalletProps {
  children: ReactNode;
}

/**
 * A component that requires a connected wallet to render its children.
 * If no wallet is connected, it redirects to the home page.
 */
const RequireWallet: React.FC<RequireWalletProps> = ({ children }) => {
  const { walletInfo } = useWallet();

  if (!walletInfo.isConnected) {
    // If wallet is not connected, redirect to the home page
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default RequireWallet;
