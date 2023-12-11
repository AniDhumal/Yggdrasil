import {React, useState, useEffect} from 'react';
import { useDetails } from '../hooks/contextHooks';
import { ethers, Contract, parseUnits, parseEther } from "ethers";
import managerAbi from '../abis/StrategyManager.json'
import vaultAbi from '../abis/ETHVault.json'
import axios, * as others from 'axios';
import {Buffer} from 'buffer';
import { Modal } from './modal';
import SelectOptions from './selectOptions';
import erc20Abi from '../abis/erc20Abi.json'


const DashboardCard = ({ heading, description, apy, _chainId, networkName, strategyAddress, strategyManagerAddress, vaultAddress }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  const [baseFee, setBaseFee] = useState(0);
  const [suggestedMaxFeePerGas, setSuggestedMaxFeePerGas] = useState(0);
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState(0);
  const [maxWaitTime, setMaxWaitTime] = useState(0);

  const [shares, setShares] = useState(0);
  
  useEffect(() => {
    (async () => {
      try {

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
    
        const abi = vaultAbi.abi;
    
        console.log("vaultAddress", vaultAddress)
        const vaultContract = new Contract(vaultAddress, abi, signer);

        let maxRedeemAmount = await vaultContract.maxRedeem(signer.address);
        console.log("maxRedeemAmount", maxRedeemAmount);
        setShares(maxRedeemAmount);

      } catch (err) {
        console.log('Error occured when fetching books');
      }
    })();
  }, []);

  const openModal = async () => {
    setModalOpen(true);
    const data = await getMetaskEstFee();
    console.log("FEE RES", data);
    setSuggestedMaxFeePerGas(data.low.suggestedMaxFeePerGas);
    setBaseFee(data.estimatedBaseFee);
    setMaxPriorityFeePerGas(data.low.suggestedMaxPriorityFeePerGas)
    setMaxWaitTime(data.low.maxWaitTimeEstimate)
  }
  const closeModal = () => setModalOpen(false);

  const [inputValue, setInputValue] = useState(0);
  const { chainId } = useDetails();

  const Auth = Buffer.from(
    process.env.REACT_APP_INFURA_API_KEY + ":" + process.env.REACT_APP_INFURA_API_KEY_SECRET,
  ).toString("base64");
  


const estimateGasFee = async () => {
  try {
    console.log("chainId", chainId)
    const { data } = await axios.get(
      `https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`,
      {
        headers: {
          Authorization: `Basic ${Auth}`,
        },
      },
    );
    console.log("Suggested gas fees:", data);
    return data;
  } catch (error) {
    console.log("Server responded with:", error);
    return null;
  }
};


  const getMetaskEstFee = async () => {
    const data = await estimateGasFee();

    const defaultFee = 50000000;
    if(data == null){
      return defaultFee
    }

    // console.log(data.estimatedBaseFee);
    return data;
    // return defaultFee;
  }


  const handleInvest = async (_amount) => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();

    // console.log(provider);

    // console.log("signer", signer)

    const abi = managerAbi.abi;

    const managerContract = new Contract(strategyManagerAddress, abi, signer);


    if(chainId == 5001){
      try {
        const erc20abi = erc20Abi;
        console.log("erc20Abi")
        let amount = ethers.parseUnits(_amount, 18)
        console.log("amount", amount);
        const erc20Contract = new Contract("0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000", erc20abi, provider)
        let tx0 = await erc20Contract.approve("0x439f7f12Ee3b5D8F51D02019C4501fb2d84054f0", amount);
        // console.log(tx0)
        // await tx0.wait();

        // console.log("calling investing......")
        // let tx = await managerContract.invest(
        //   amount, 
        //   strategyAddress
        // );
        // console.log("tx", tx)
        // await tx.wait()
      } catch (error) {
        console.log("transaction reverted");
        console.log(error)
      }
      
    }else{
        try {
          console.log("calling investing......")
          let tx = await managerContract.invest(
            ethers.parseEther('0'), 
            strategyAddress, {
              value: ethers.parseEther(_amount),
            }, 
          );
          console.log("tx", tx)
          await tx.wait()
        } catch (error) {
          console.log("transaction reverted");
        }
    }
        
}

  const handleDivest = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();

    const abi = vaultAbi.abi;

    console.log("vaultAddress", vaultAddress)
    const vaultContract = new Contract(vaultAddress, abi, signer);

    // console.log(vaultContract)

    // const nonce = await getUserNonce(signer.address);

    try {
      let maxRedeemAmount = await vaultContract.maxRedeem(signer.address);
      console.log("maxRedeemAmount", maxRedeemAmount);
      console.log("shares", shares);
      // Send the transaction
      console.log("calling investing......")
      let tx = await vaultContract.redeem(
        maxRedeemAmount,
        signer.address,
        signer.address, 
      );
      console.log("tx", tx)
      await tx.wait()
    } catch (error) {
      console.log("transaction reverted");
    }
  }

  //@todo implementing the get user's nonce
  const getUserNonce = async (userAddress) => {
    return 1;
  }

  const handleInputInvestChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOption = async (selectedOption) => {
    console.log('selected', selectedOption)
    setSelectedOption(selectedOption);

    if(selectedOption == 1){
      const data = await getMetaskEstFee();
      console.log("FEE RES", data);
      setSuggestedMaxFeePerGas(data.low.suggestedMaxFeePerGas);
      setBaseFee(data.estimatedBaseFee);
      setMaxPriorityFeePerGas(data.low.suggestedMaxPriorityFeePerGas);
      setMaxWaitTime(data.low.maxWaitTimeEstimate)
    }else if(selectedOption == 2){
      const data = await getMetaskEstFee();
      console.log("FEE RES", data);
      setSuggestedMaxFeePerGas(data.medium.suggestedMaxFeePerGas);
      setBaseFee(data.medium.suggestedMaxFeePerGas);
      setMaxPriorityFeePerGas(data.medium.suggestedMaxPriorityFeePerGas);
      setMaxWaitTime(data.medium.maxWaitTimeEstimate)
    }else if(selectedOption == 3){
      const data = await getMetaskEstFee();
      console.log("FEE RES", data);
      setSuggestedMaxFeePerGas(data.high.suggestedMaxFeePerGas);
      setBaseFee(data.high.suggestedMaxFeePerGas);
      setMaxPriorityFeePerGas(data.high.suggestedMaxPriorityFeePerGas);
      setMaxWaitTime(data.high.maxWaitTimeEstimate)
    }

    console.log("final fee:", suggestedMaxFeePerGas * 10**9);

    

    
  }

  function convertMillisecondsToSeconds(milliseconds) {
    const seconds = milliseconds / 1000;
    return seconds;
  }


  function convertBigIntToNumber(bigIntValue) {
    // Using Number() constructor
    // Note: This might lose precision for very large BigInt values
    const regularNumber1 = Number(bigIntValue);
  
    // Using unary plus (+) operator
    // Note: This might lose precision for very large BigInt values
    const regularNumber2 = +bigIntValue;
  
    return [regularNumber1, regularNumber2];
  }
  


  return (
    <div className={`${chainId !== _chainId ? 'bg-white' : 'bg-slate-400'}  rounded-md shadow-md p-4 my-8 shadow-2xl`}>
      {chainId !== _chainId ? <p className='m-8 p-2 text-lg text-white bg-red-300 rounded-lg'> ⚠️ Please switch network to <span className='font-semibold'>{networkName == 'mainnet' ? 'Ethereum' + ' ' + networkName : networkName}</span>  to use this strategy</p> : <></>}

      <p className='mx-8 my-5 p-1 bg-teal-300 rounded-lg text-sm w-fit'>Network: {networkName}</p>
      <h2 className="m-8 text-xl font-bold mb-2">{heading}</h2>
      <p className="m-8 text-gray-700">{description}</p>
      <hr className="my-4" />

      <h2  className="m-8 text-lg font-light mb-2"> Projected APY</h2>
      <p className="m-8 text-gray-700">{apy}%</p>

      <hr className="my-4" />

        <div className='flex bg-slate-50'>
          <div className='m-8 w-1/2 mt-12'>
            {/* <h3 className='m-2 p-2'>Available balance:{}</h3> */}

            <h3 className='mx-2 p-2'>Deposit Amount</h3>

            <div className="flex flex-col">
              <input type="number" value={inputValue} className="m-2 p-2" placeholder='0.0' onChange={handleInputInvestChange}></input>
              { chainId == 59140 
                ?
                <button onClick={openModal} className={`m-2 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ${chainId !== _chainId ? 'disabled:opacity-50 cursor-not-allowed': ''}`} disabled={chainId !== _chainId}>
                    Invest
                  </button>
                :
                  <button onClick={()=>handleInvest(
                    inputValue.toString()
                  )} className={`m-2  bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ${chainId !== _chainId ? 'disabled:opacity-50 cursor-not-allowed': ''}`} disabled={chainId !== _chainId}>
                  Invest
                </button>  
              }
            </div>

          </div>


            <div className='m-8 w-1/2'>
                <h3 className='m-2 p-2'>Available Shares:</h3>

                {/* <h2 className='mx-2 p-2'>Withdrawal Amount</h2> */}

                <div className="flex flex-col">
                  <input disabled className="m-2 p-2" placeholder={shares}></input>
                  <button 
                    className={`m-2 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ${chainId !== _chainId ? 'disabled:opacity-50 cursor-not-allowed': ''}`} 
                    disabled={chainId !== _chainId}
                    onClick={handleDivest}
                  >
                  Divest
                  </button>
                </div>

                
                <div>
                    <Modal isOpen={isModalOpen} onClose={closeModal} title="Gas Fee Info">
                      <div>

                        <p className='text-xl p-2 font-sans'> ~ {baseFee}</p>
                        <p className='text-sm p-2 font-sans'>max fee {suggestedMaxFeePerGas}</p>
                        <p className='text-sm p-2 font-sans'>max priority fee per gas {maxPriorityFeePerGas}</p>
                        <p className='text-sm p-2 font-sans'>max wait time {convertMillisecondsToSeconds(maxWaitTime)} secs</p>

                        <div className='flex justify-between m-6'>
                          <div>
                            <div onClick={() => handleOption(1)} className={`rounded-[50%] border ml-1 mb-3 w-5 h-5 ${selectedOption == 1 ? 'bg-teal-500' : 'bg-slate-200 '}`}></div>
                            <p>low</p>
                          </div>

                          <div>
                            <div onClick={() => handleOption(2)} className={`rounded-[50%] border ml-4 mb-3 w-5 h-5 ${selectedOption == 2 ? 'bg-teal-500' : 'bg-slate-200 '}`}></div>
                            <p>medium</p>
                          </div>

                          <div>
                            <div onClick={() => handleOption(3)} className={`rounded-[50%] border ml-1 mb-3 w-5 h-5 ${selectedOption == 3 ? 'bg-teal-500' : 'bg-slate-200 '}`}></div>
                            <p>high</p>
                          </div>
                        </div>

                        <button onClick={()=>handleInvest(
                          inputValue.toString()
                        )} className={` w-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ${chainId !== _chainId ? 'disabled:opacity-50 cursor-not-allowed': ''}`} disabled={chainId !== _chainId}>
                          Invest
                        </button>

                      </div>

                    </Modal>
                  </div>

             </div>

        </div>
    </div>
  );
};

export default DashboardCard;






  // let signer = null;

  // const getBalance = async () => {
  //   const provider = new ethers.BrowserProvider(window.ethereum)
  //   const signer = await provider.getSigner();
  
  //   const abi = [
  //     "function decimals() view returns (string)",
  //     "function symbol() view returns (string)",
  //     "function balanceOf(address addr) view returns (uint)"
  //   ]
    
  //   // Create a contract
  //   const contract = new Contract("0x7e752bC77eBE2225B327e6ebF09fAD7801873931", abi, provider)
  //     console.log(await contract.symbol())
  // } 

  // const approve = async (contract, _spender, _amount) => {
  //   const provider = new ethers.BrowserProvider(window.ethereum)
  //   const signer = await provider.getSigner();

  //   // console.log("_amount", await contract.decimals());
  //   let amount = parseUnits('10', 18);

  //   console.log("amount", amount)
    
  //   // Send the transaction
  //   let tx = await contract.approve(_spender, amount)
  //   await tx.wait()
  // }