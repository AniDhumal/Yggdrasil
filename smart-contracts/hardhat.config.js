require("@nomicfoundation/hardhat-toolbox");

// NEVER record important private keys in your code - this is for demo purposes
const GOERLI_TESTNET_PRIVATE_KEY =
  "cbc44f3dfb4047eb4e86a48a3278a3f48bebe0f953bb65ddeb982faa5a3a8bca";
const ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY = "";
const LINEA_TESTNET_PRIVATE_KEY =
  "0xcbc44f3dfb4047eb4e86a48a3278a3f48bebe0f953bb65ddeb982faa5a3a8bca";

const { INFURA_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.14",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    arbitrumGoerli: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: 421613,
      accounts: [GOERLI_TESTNET_PRIVATE_KEY],
    },
    arbitrumOne: {
      url: "https://arb1.arbitrum.io/rpc",
      //accounts: [ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY]
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: [GOERLI_TESTNET_PRIVATE_KEY],
    },
    linea_testnet: {
      url: "https://linea-goerli.infura.io/v3/371af9d712614049b443043a9202cd6e",
      // chainId: 59140,
      accounts: [LINEA_TESTNET_PRIVATE_KEY],
    },
    linea_mainnet: {
      url: "https://rpc.linea.build/",
      accounts: [LINEA_TESTNET_PRIVATE_KEY],
    },
    scrollTestnet: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [LINEA_TESTNET_PRIVATE_KEY],
      minGasPrice: 10000000,
    },
    // etherscan: {
    //   apiKey: "ABCDE12345ABCDE12345ABCDE123456789",
    // },
  },
};
