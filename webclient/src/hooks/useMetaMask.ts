import { useEffect, useState } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';

interface RequestArguments {
  method: string
  params?: unknown[] | object
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: RequestArguments) => Promise<unknown>,
      selectedAddress: string | null,
      on: (event: string, handler: (...args: any) => void) => void,
      removeListener: (event: string, handler: (...args: any) => void) => void,
      [key: string]: any
    };
  }
}

const useMetaMask = () => {
  const [selectedAddress, setSelectedAddress] = useState<string|null>(null);
  const [onboarding, setOnboarding] = useState<MetaMaskOnboarding|null>(null);

  const _updateSelectedAddress = () => setTimeout(() => {
    setSelectedAddress(window.ethereum?.selectedAddress || null);
  }, 200);

  const connectWallet = async (): Promise<void> => {
    try {
      const { ethereum } = window;
      if (!ethereum)
        throw new Error('MetaMask is not installed.');
      await ethereum.request({method: 'eth_requestAccounts'});
    } catch (e: any) {
      console.error(e);
      if (e?.code !== 4001)
        window.alert(`Wallet Connect Error: ${e.message}`);
    }
  };

  useEffect(() => {
    if (!onboarding)
      setOnboarding(new MetaMaskOnboarding());
  }, []);

  useEffect(() => {
    _updateSelectedAddress();
    window.ethereum?.on('accountsChanged', _updateSelectedAddress);
    window.ethereum?.on('chainChanged', _updateSelectedAddress);
    window.ethereum?.on('connect', _updateSelectedAddress);

    return () => {
      window.ethereum?.removeListener('accountsChanged', _updateSelectedAddress);
      window.ethereum?.removeListener('chainChanged', _updateSelectedAddress);
      window.ethereum?.removeListener('connect', _updateSelectedAddress);
    };
  }, []);

  return {
    onboarding,
    connectWallet,
    selectedAddress,
    getEthereumInstance: () => {
      if (!window.ethereum)
        throw new Error('MetaMask is not installed');
      return window.ethereum;
    },
    isMetaMaskInstalled: MetaMaskOnboarding.isMetaMaskInstalled(),
  };
};

export default useMetaMask;
