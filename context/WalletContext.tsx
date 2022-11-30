import React, { createContext, useContext, useState } from 'react'
import ConnectWallet from '../component/Button/ConnectWallet';

const defaultValue = {
    connectWallet:()=>{},
    address:"",
    provider:null,
    web3:null,
    chainId:6868,
    wrongChain:false
}

const WalletContext = createContext(defaultValue);

const expectedChains = [1,56];

export default function WalletContextProvider({children}:any) {
    const [address,setAddress] = useState('0x');
    const [provider,setProvider] = useState(null);
    const [web3,setWeb3] = useState(null);
    const [chainId,setChainId] = useState(6868);
    const [wrongChain,setWrongChain] = useState(false);
    
    const connectWallet = ()=>{
        const Window:any = window;
        if(Window.ethereum){
            Window.ethereum.request({ method: 'eth_requestAccounts' }).then((e:any)=>{
                setAddress(e[0]);
                setProvider(Window.ethereum);
                // set(Window.ethereum);
            }).catch((err:any)=>{
                console.log(err);
            });
            Window.ethereum.on('accountsChanged',(accounts:string[])=>{
                setAddress(accounts[0]);
            })
            Window.ethereum.on('chainChanged',async (chainId:string)=>{
                let chain = parseInt(chainId.slice(2),16);
                if(!expectedChains.includes(chain)){
                    setWrongChain(true);
                    try {
                        await Window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: '0x'+ expectedChains[0].toString(16)}],
                        });
                    } catch (switchError) {
                        // if (switchError.code === 4902) {
                        //   try {
                        //     await ethereum.request({
                        //       method: 'wallet_addEthereumChain',
                        //       params: [
                        //         {
                        //           chainId: '0xf00',
                        //           chainName: '...',
                        //           rpcUrls: ['https://...'] /* ... */,
                        //         },
                        //       ],
                        //     });
                        //   } catch (addError) {
                        //     // handle "add" error
                        //   }
                        // }
                        
                        // Add The Chain expectedChains[0]
                      }
                }else{
                    setWrongChain(false);
                }
            })
        }else{
            // Alert user about Metamask Not Available
            console.log("Metamask Not Installed")
        }
    }
    const store = {
        connectWallet,
        address,
        provider,
        web3,
        chainId,
        wrongChain
    }
    return (
        <WalletContext.Provider value={store}>
            {children}
        </WalletContext.Provider>
    )
}

export function useWalletContext(){
    return useContext(WalletContext);
}