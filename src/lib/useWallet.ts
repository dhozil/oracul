import { useState, useEffect, useCallback } from 'react';
import { GENLAYER_CHAIN_PARAMS, GENLAYER_NETWORKS } from './genlayer-network';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  balance: string;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToGenLayer: () => Promise<boolean>;
  addToMetaMask: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    balance: '0',
    error: null,
  });

  const getBalance = useCallback(async (address: string) => {
    if (!window.ethereum) return '0';
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      const balanceHex = balance as string;
      const balanceWei = parseInt(balanceHex, 16);
      const balanceEth = balanceWei / 1e18;
      return balanceEth.toFixed(4);
    } catch {
      return '0';
    }
  }, []);

  const switchToGenLayer = useCallback(async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: GENLAYER_CHAIN_PARAMS.chainId }],
      });
      return true;
    } catch (switchError: unknown) {
      const error = switchError as { code?: number };
      if (error.code === 4902) {
        try {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [GENLAYER_CHAIN_PARAMS],
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((prev) => ({
        ...prev,
        error: 'MetaMask not installed. Please install MetaMask to continue.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      const chainIdHex = (await window.ethereum.request({
        method: 'eth_chainId',
      })) as string;
      const chainId = parseInt(chainIdHex, 16);

      if (chainId !== GENLAYER_NETWORKS.studionet.chainId) {
        await switchToGenLayer();
      }

      const balance = await getBalance(accounts[0]);

      setState({
        address: accounts[0],
        isConnected: true,
        isConnecting: false,
        chainId,
        balance,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: err instanceof Error ? err.message : 'Failed to connect wallet',
      }));
    }
  }, [switchToGenLayer, getBalance]);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      balance: '0',
      error: null,
    });
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        disconnect();
      } else if (state.isConnected) {
        const balance = await getBalance(accounts[0]);
        setState((prev) => ({
          ...prev,
          address: accounts[0],
          balance,
        }));
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const chainIdHex = args[0] as string;
      const chainId = parseInt(chainIdHex, 16);
      setState((prev) => ({ ...prev, chainId }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Auto-detect existing connection on load
    window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
      const accountList = accounts as string[];
      if (accountList.length > 0) {
        // Already connected, get chain and balance
        Promise.all([
          window.ethereum!.request({ method: 'eth_chainId' }),
          getBalance(accountList[0]),
        ]).then(([chainIdHex, balance]) => {
          const chainId = parseInt(chainIdHex as string, 16);
          setState({
            address: accountList[0],
            isConnected: true,
            isConnecting: false,
            chainId,
            balance,
            error: null,
          });
        }).catch(() => {});
      }
    }).catch(() => {});

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [state.isConnected, disconnect, getBalance]);

  const addToMetaMask = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [GENLAYER_CHAIN_PARAMS],
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to add network',
      }));
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    switchToGenLayer,
    addToMetaMask,
  };
}
