import React, { createContext, useContext, useState } from 'react'
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';


const ProJectID = "4a5b98d025fa3b39b96e7fd686ded374";


const defaultValue = {
    connectMetamaskWallet:()=>{},
    connectWalletConnect:()=>{},
    address:"",
    provider:null,
    web3:null,
    chainId:6868,
    wrongChain:false
}

const WalletContext = createContext(defaultValue);

const expectedChains = [1,56,1353];

export default function WalletContextProvider({children}:any) {
    const [address,setAddress] = useState('0x');
    const [provider,setProvider] = useState(null);
    const [web3,setWeb3] = useState<any>(null);
    const [chainId,setChainId] = useState(6868);
    const [wrongChain,setWrongChain] = useState(false);
    
    const connectMetamaskWallet = ()=>{
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
    const connectWalletConnect = ()=>{
        try{

            const provider1:any = new WalletConnectProvider({
                rpc: {
                    1353: "https://xapi.cicscan.com",
                    56:"",
                    1:""
                },
                infuraId:"c22c90a767684c5fbd7257da57802b35"
            });
            provider1.enable().then(async (res:any)=>{
                console.log(res);
                let web3 = new Web3(provider1);
                setAddress(res[0]);
                let chainid = await web3.eth.getChainId();
                // setWeb3(new Web3(provider1));
                // provider1.chainId()
                setChainId(chainid)
                if(!expectedChains.includes(chainid)){
                    setWrongChain(true);
                }
                setProvider(provider1);
            }).catch((e:any)=>{
                console.log(e);
            })
            
            provider1.on("accountsChanged", (accounts: string[]) => {
                setAddress(accounts[0]);
            });
            
            // Subscribe to chainId change
            provider1.on("chainChanged", (chainId: number) => {
                try{    
                    if(!expectedChains.includes(chainId)){
                        setWrongChain(true);
                    }else{
                        setWrongChain(false);
                    }
                }catch(e){
                    console.log(chainId);
                }
            });
            provider1.on("error",(e:any)=>{
                console.log(e);
            })
        }catch(e){

        }
    }
    const store = {
        connectMetamaskWallet,
        connectWalletConnect,
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