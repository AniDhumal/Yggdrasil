import {React, useEffect, useState} from 'react';
import DashboardCard from "../components/dashboardCard";
import Dropdown from "../components/dropdown";
import { useDetails } from '../hooks/contextHooks';

function Actions() { 

  const { chainId } = useDetails();
  let [sortedArray, setSortedArray] = useState();

    // const options = ['Option 1', 'Option 2', 'Option 3'];
    // Sample data for multiple cards
  const cardsData = [
    {
      id: 1,
      heading: 'Simple staking strategy',
      description: 'Farm yield by depositing into a vault which is intended to be used as a treasury in case of emergency',
      apy : 60,
      chainId: 59140,
      networkName: 'Linea Goerli',
      strategyAddress: '0x83EfCf6d2C4FD9ED637BF9da8dD19174308d532B',
      strategyManagerAddress: '0x88c8627816361f1438C8D4C692647BbCc96FF50d',
      vault: "0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340"
    },
    {
      id: 2,
      heading: 'Angel Investing Strategy',
      description: 'Leverage high user traffic in Arbitrum for a custom Angel Investing vault',
      apy : 70,
      chainId: 421613,
      networkName: 'Arbitrum Goerli',
      strategyAddress: '0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340',
      strategyManagerAddress: '0x19d12870077DDb6C53FbDeF6818ED504e63b23Ab',
      vault: "0x08b59B9c3aAB242745f603F68eA6F992aaF473C0"
    },
    {
      id: 3,
      heading: 'Privacy investing',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding ETH vault using 0 slippage',
      apy : 50,
      chainId: 534351,
      networkName: 'Scroll Sepolia',
      strategyAddress: '0x5B7d72e1B7EDfF99153fE0b722548B154E7c86f1',
      strategyManagerAddress: '0x08b59B9c3aAB242745f603F68eA6F992aaF473C0',
      vault: "0x4401DE98fE700c5E2c62b2f2C6BeD4AEE135fC58"
    },
    {
      id: 4,
      heading: 'Simple staking strategy ',
      description: 'Farm yield by depositing into a vault which is intended to be used as a treasury in case of emergency',
      apy : 50,
      chainId: 1442,
      networkName: 'Polygon zkEVM Testnet',
      strategyAddress: '0xD54c7403F7f5c2dFEA07669C6b9b52F6bdc21AE5',
      strategyManagerAddress: '0x938c795358fD433aDdbd1374eCe2aD69D61a31F2',
      vault: "0x83E6B164C6D130567316cECF3Bc7879203772943"
    },
    {
      id: 5,
      heading: 'Angel Investing Strategy',
      description: 'Leverage high user traffic in Arbitrum for a custom Angel Investing vault',
      apy : 50,
      chainId: 84531,
      networkName: 'Base Goerli',
      strategyAddress: '0x4401DE98fE700c5E2c62b2f2C6BeD4AEE135fC58',
      strategyManagerAddress: '0xD54c7403F7f5c2dFEA07669C6b9b52F6bdc21AE5',
      vault: "0x938c795358fD433aDdbd1374eCe2aD69D61a31F2"
    },
    {
      id: 6,
      heading: 'JediSwap Naive Joint Liquidity vault for DAI/ETH (DAI tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding ETH vault using 0 slippage',
      apy : 50,
      chainId: 5001,
      networkName: 'Mantle Testnet',
      strategyAddress: '0x439f7f12Ee3b5D8F51D02019C4501fb2d84054f0',
      strategyManagerAddress: '0x938c795358fD433aDdbd1374eCe2aD69D61a31F2',
      vault: "0x83E6B164C6D130567316cECF3Bc7879203772943"
    },

  ];

  function filterAndMoveFirst(cardsData, targetChainId) {
    if(chainId == undefined){
      return cardsData;
    }
    // Filter out items that match the target chainId
    const matchingItems = cardsData.filter(item => item.chainId === targetChainId);
  
    // Filter out items that do not match the target chainId
    const nonMatchingItems = cardsData.filter(item => item.chainId !== targetChainId);
  
    // Concatenate the arrays with matching items at the first index
    const newArray = [...matchingItems, ...nonMatchingItems];
  
    return newArray;
  }


    const handleOptionSelect = (selectedOption) => {
      console.log(`Selected option: ${selectedOption}`);
      // Add logic to handle the selected option
    };


    useEffect(() => {
      (async () => {
        try {
          let newArray = filterAndMoveFirst(cardsData, chainId);
          setSortedArray(newArray);  
        } catch (err) {
          console.log('Error occured when fetching books');
        }
      })();
    }, [chainId]);

    return ( 
       <div className="h-full flex justify-center w-full"> 

          <div className="mt-10 bg-slate-50 w-full mx-20 p-10">
              {chainId === undefined ? (
              // Render original cardsData if chainId is undefined
              cardsData.map(card => (
                <DashboardCard
                      key={card.id}
                      heading={card.heading}
                      description={card.description}
                      apy={card.apy}
                      _chainId={card.chainId}
                      networkName={card.networkName}
                      strategyAddress={card.strategyAddress}
                      strategyManagerAddress={card.strategyManagerAddress}
                      vaultAddress={card.vault}
                    />
                  ))
                ) : (
                  // Render sortedArray if chainId is defined
                  sortedArray?.map(card => (
                    <DashboardCard
                      key={card.id}
                      heading={card.heading}
                      description={card.description}
                      apy={card.apy}
                      _chainId={card.chainId}
                      networkName={card.networkName}
                      strategyAddress={card.strategyAddress}
                      strategyManagerAddress={card.strategyManagerAddress}
                      vaultAddress={card.vault}
                    />
                  ))
                )}
          </div>
      </div> 
    ); 
} 
export default Actions; 