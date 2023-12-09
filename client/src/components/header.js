
import { ethers } from "ethers";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { useDetails } from "../hooks/contextHooks";




const provider = new ethers.BrowserProvider(window.ethereum);

export default function Header() {

    const { chainId, setChainId } = useDetails();

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);



    const connectwalletHandler = async () => {
        if (window.ethereum) {
          provider.send("eth_requestAccounts", []).then(async () => {
            await accountChangedHandler(await provider.getSigner());
          });

            console.log("ethererum::", window.ethereum)

            const chainId = Number(await window.ethereum.request({ method: "eth_chainId" }));
            // console.log("chainId:", chainId)
            // const network = await provider.getNetwork(chainId);
            // console.log(`Network name: ${network.name}, id:${network.chainId}`);

            setChainId(chainId);


        } else {
          setErrorMessage("Please Install Metamask!!!");
        }
      };
    
      // Detect change in Metamask account
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", async () => {
        window.location.reload();
        await connectwalletHandler();
        console.log("chain changed");
      });
      window.ethereum.on("accountsChanged", async() => {
        window.location.reload();
        await connectwalletHandler();
        console.log("account changed");
      });
    }
  });

    const accountChangedHandler = async (newAccount) => {
        console.log("network", newAccount);
        const address = await newAccount.getAddress();
        // console.log("address", address)
        setDefaultAccount(address);
        // const balance = await newAccount.getBalance();
        // setUserBalance(ethers.formatEther(balance));
        // await getuserBalance(address);
      };

    //   const getuserBalance = async (address) => {
    //     const balance = await provider.getBalance(address, "latest");
    //   };

    function shortenEthereumAddress(address, startLength = 6, endLength = 4) {
        if (address.length < startLength + endLength + 2) {
          // Check if the address is too short to be shortened
          console.error("Invalid Ethereum address");
          return address;
        }
      
        const start = address.slice(0, startLength);
        const end = address.slice(-endLength);
      
        return `${start}...${end}`;
      }

    return (
    <div>
      <div className='flex justify-between items-center mx-20 p-4'>
        <div className="flex justify-evenly ">
            <h1 className='mr-24 text-green-600 hover:text-lime-500 font-extrabold text-3xl p-4 p font-mono  antialiased'>Yggdrasil</h1>

            <Link className="m-6 font-semibold text-zinc-500 hover:text-teal-600" to="/" >  Dashboard  </Link> 
            <Link className="m-6 font-semibold text-zinc-500 hover:text-teal-600" to="/strategies" >  Strategies </Link> 
            <Link className="m-6 font-semibold text-zinc-500 hover:text-teal-600" to="/investments" >  Investments </Link> 
        </div>

        {defaultAccount == null ? 
            <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded" onClick={connectwalletHandler}>Connect Wallet</button> 
        : <h1 className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">{shortenEthereumAddress(defaultAccount)}</h1>
        }
        
        </div>
        <hr className="my-2" />
    </div>
    )
  }

