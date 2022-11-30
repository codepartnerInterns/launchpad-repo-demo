import React from 'react'
import { useWalletContext } from '../../context/WalletContext';

export default function ConnectWallet() {
    const wallet = useWalletContext();

    return (
        <>
            {wallet.address == '0x' ? <button className="bg-indigo-700 px-6 py-2 text-white rounded"
            onClick={wallet.connectWalletConnect}>
                Connect Wallet
            </button>: (wallet.wrongChain ? <p  className="bg-red-500 px-4 py-2 text-white rounded">{wallet.address.slice(0,6)}...{wallet.address.slice(-4)}</p>:<p  className="bg-indigo-700 px-4 py-2 text-white rounded">{wallet.address.slice(0,6)}...{wallet.address.slice(-4)}</p>)}
        </>
    )
}
