import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';
import { WalletProvider } from './context/WalletContext';
import RequireWallet from './components/RequireWallet';

const AppContent: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [favorites, setFavorites] = useState(['1', '4']);
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    // Mock wallet connection with animation
    setTimeout(() => {
      setWalletConnected(!walletConnected);
    }, 1000);
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  // Toggle between mock wallet and real wallet functionality
  const useRealWallet = true;

  return (
    <>
      <Navbar
        onConnectWallet={handleConnectWallet}
        walletConnected={walletConnected}
        useRealWallet={useRealWallet}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          }
        />
        <Route
          path="/listings"
          element={
            <ListingsPage
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          }
        />
        <Route
          path="/property/:id"
          element={<PropertyDetailPage onToggleFavorite={handleToggleFavorite} />}
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireWallet>
              <DashboardPage
                walletConnected={walletConnected}
                onConnectWallet={handleConnectWallet}
                useRealWallet={useRealWallet}
              />
            </RequireWallet>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </Router>
  );
}

export default App;
