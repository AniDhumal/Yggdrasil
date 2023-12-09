export const CONFIG = {
  CHAIN_NAME_MAPPING: {
    ETHEREUM_GOERLI: 5,
    ARBITRUM_GOERLI: 421613,
    POLYGON_MAINNET: 137,
  },
  CHAIN_MAPPING: {
    '5': 'ETH',
    '421613': 'ARBITRUM',
    '137': 'POLYGON',
  },
  PRICE_FLUCTUATION_FACTOR: 5,
  ADDRESSES: {
    ETHEREUM: {
      TESTNET: {
        StaderStakePoolManager: '0xd0e400Ec6Ed9C803A9D9D3a602494393E806F823',
        wstETH: '0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f',
      },
      // ? Strategies which are dependent on 1 inch fusion api for performing slippage less swaps and then investing according to the particular strategy
      // ? Only on Polygon POS
    },
    POLYGON: {
      MAINNET: {
        SPECIAL_STRATEGY_ADDRESS: [''],
      },
    },
  },
};
