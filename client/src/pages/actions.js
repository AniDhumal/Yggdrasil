import DashboardCard from "../components/dashboardCard";
import Dropdown from "../components/dropdown";

function Actions() { 
    // const options = ['Option 1', 'Option 2', 'Option 3'];
    // Sample data for multiple cards
  const cardsData = [
    {
      id: 1,
      heading: 'JediSwap Naive Joint Liquidity vault for DAI/ETH (ETH tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding DAI vault using 0 slippage',
      apy : 60,
      chainId: 59140,
      networkName: 'Linea Goerli',
      strategyAddress: '0x83EfCf6d2C4FD9ED637BF9da8dD19174308d532B',
      strategyManagerAddress: '0x88c8627816361f1438C8D4C692647BbCc96FF50d',
      vault: "0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340"
    },
    {
      id: 2,
      heading: 'JediSwap Naive Joint Liquidity vault for DAI/ETH (DAI tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding ETH vault using 0 slippage',
      apy : 70,
      chainId: 421613,
      networkName: 'Arbitrum Goerli',
      strategyAddress: '0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340',
      strategyManagerAddress: '0x19d12870077DDb6C53FbDeF6818ED504e63b23Ab',
      vault: "0x08b59B9c3aAB242745f603F68eA6F992aaF473C0"
    },
    {
      id: 3,
      heading: 'JediSwap Naive Joint Liquidity vault for DAI/ETH (DAI tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding ETH vault using 0 slippage',
      apy : 50,
      chainId: 534351,
      networkName: 'Scroll Sepolia',
      strategyAddress: '0x2E1042A93a8657Bad5BcBFa88F59a59abE42f7d2',
      strategyManagerAddress: '0x5B7d72e1B7EDfF99153fE0b722548B154E7c86f1',
      vault: "0x4401DE98fE700c5E2c62b2f2C6BeD4AEE135fC58"
    },
  ];


    const handleOptionSelect = (selectedOption) => {
      console.log(`Selected option: ${selectedOption}`);
      // Add logic to handle the selected option
    };

    return ( 
       <div className="h-full flex justify-center w-full"> 
            {/* <h1 className=""> This is the Actions page </h1>  */}
            {/* <Dropdown options={options} onSelect={handleOptionSelect} /> */}

            <div className="mt-10 bg-slate-50 w-full mx-20 p-10">
                {cardsData.map((card) => (
                    <DashboardCard
                        key={card.id}
                        heading={card.heading}
                        description={card.description}
                        apy={card.apy}
                        _chainId={card.chainId}
                        networkName={card.networkName}
                        strategyAddress={card.strategyAddress}
                        strategyManagerAddress={card.strategyManagerAddress}
                      />
                ))}
            </div>
      </div> 
    ); 
} 
export default Actions; 