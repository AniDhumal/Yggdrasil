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
      strategyManagerAddress: '0x88c8627816361f1438C8D4C692647BbCc96FF50d'
    },
    {
      id: 2,
      heading: 'JediSwap Naive Joint Liquidity vault for DAI/ETH (DAI tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding ETH vault using 0 slippage',
      apy : 70,
      chainId: 1,
      networkName: 'mainnet',
      strategyAddress: '0x938c795358fD433aDdbd1374eCe2aD69D61a31F2',
      strategyManagerAddress: '0x83E6B164C6D130567316cECF3Bc7879203772943'
    },
    {
      id: 3,
      heading: 'JediSwap Naive Joint Liquidity vault for DAI/ETH (DAI tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding ETH vault using 0 slippage',
      apy : 50,
      chainId: 137,
      networkName: 'polygon mainnet',
      strategyAddress: '0xB8A3D563c7A68d847e648B5d114D2ADC43E8444d',
      strategyManagerAddress: '0xB7e797FEC988791daa024549d29dadD29213755E'
    },
    {
      id: 4,
      heading: 'JediSwap Naive Joint Liquidity vault for DAI/ETH (DAI tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding ETH vault using 0 slippage',
      apy : 50,
      chainId: 5,
      networkName: 'Goerli',
      strategyAddress: '0x938c795358fD433aDdbd1374eCe2aD69D61a31F2',
      strategyManagerAddress: '0x83E6B164C6D130567316cECF3Bc7879203772943'
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