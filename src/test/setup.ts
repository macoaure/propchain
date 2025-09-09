import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock window.ethereum
global.window.ethereum = {
  isMetaMask: true,
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
} as any;

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
