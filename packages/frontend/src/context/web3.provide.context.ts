'use client';

import { useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers';
import { Web3Context, Web3ContextType} from './web3.create.context';
import React from 'react';

export function Web3Provider ({ children } : { children: ReactNode}) {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

    const connect = async ()=> {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const prov = new ethers.BrowserProvider(window.ethereum);
                const accounts = await prov.send("eth_requestAccounts", []);
                setAccount(accounts[0])
                setProvider(prov)
            } catch (error) {
                console.error('Error connecting to MetaMask', error)
            }
        } else {
            alert('Please install MetaMask')
        }
    }

    const disconnect = () => {
        setAccount(null);
        setProvider(null)
    }

    function updateWallet (accounts : string[]) {
        setAccount(accounts[0] || null)
    }

    function updateWalletandAccount () {
        window.location.reload()
    }

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', updateWallet);

            window.ethereum.on('chainChanged', updateWalletandAccount)
        }

        return() => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', updateWallet);
                window.ethereum.removeListener('chainChanged', updateWalletandAccount)
            }
        }
    }, [])

    // Create the value object
    const contextValue: Web3ContextType = {
        account,
        provider,
        connect,
        disconnect,
        isConnected: !!account
    };

    return (
        React.createElement(Web3Context.Provider, {value: contextValue}, children)
      );        
}

export function useWeb3() {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error ('useWeb3 must be used within a Web3Provider');
    }
    return context;
}