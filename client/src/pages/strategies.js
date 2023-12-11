import StratedyCard from "../components/strategyCard";

function Strategies() { 
      // const options = ['Option 1', 'Option 2', 'Option 3'];
    // Sample data for multiple cards
  const cardsData = [
    {
      id: 1,
      heading: 'Shushi Naive Joint Liquidity vault for DAI/ETH (ETH tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding DAI vault using 0 slippage',
      apy : 60
    },
    {
      id: 2,
      heading: 'uniswap Naive Joint Liquidity vault for DAI/ETH (DAI tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding ETH vault using 0 slippage',
      apy : 70
    },
    {
      id: 3,
      heading: 'Aave Naive Joint Liquidity vault for DAI/ETH (DAI tranche)',
      description: 'Jointly mints JediSwap DAI/ETH liquidity shares with the corresponding ETH vault using 0 slippage',
      apy : 50
    },
  ];

    return ( 
      <div className="h-full flex justify-center w-full"> 
            {/* <h1 className=""> This is the Actions page </h1>  */}
            {/* <Dropdown options={options} onSelect={handleOptionSelect} /> */}

            <div className="mt-10 bg-slate-50 w-full mx-20 p-10">
                {cardsData.map((card) => (
                    <StratedyCard
                        key={card.id}
                        heading={card.heading}
                        description={card.description}
                        apy={card.apy}
                      />
                ))}
            </div>
      </div>  
    ); 
} 
export default Strategies; 