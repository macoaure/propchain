import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Define interface for window with ethereum property
declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: ReturnType<typeof vi.fn>;
      on: ReturnType<typeof vi.fn>;
      removeListener: ReturnType<typeof vi.fn>;
    };
  }
}

// Mock window.ethereum
window.ethereum = {
  isMetaMask: true,
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
};

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
