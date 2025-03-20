import { createContext } from 'react';
import { ethers } from 'ethers';

export interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

export const Web3Context = createContext<Web3ContextType | null>(null);