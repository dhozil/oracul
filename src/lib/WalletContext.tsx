import { createContext, useContext, type ReactNode } from 'react';
import { useWallet, type WalletState } from './useWallet';

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}

export function useSharedWallet(): WalletState {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useSharedWallet must be used within WalletProvider');
  }
  return context;
}
