require("@nomicfoundation/hardhat-toolbox");
// require('dotenv').config();
// NEVER record important private keys in your code - this is for demo purposes
const GOERLI_TESTNET_PRIVATE_KEY =
  "cbc44f3dfb4047eb4e86a48a3278a3f48bebe0f953bb65ddeb982faa5a3a8bca";
const ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY = "";
console.log(process.env.POLYGON_PRIVATE_KEY);
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
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
      url: `https://polygon-mumbai.g.alchemy.com/v2/hBtEEsmM9S1maj7su0ErfydWJxG4XkTd`,
      chainId: 80001,
      accounts: ["b140170ae7370304b2f44dc8dc216ead3943da96c5de3484383ff167f662dbc4"],
      gas: 2100000,
      gasPrice: 8000000000,
      saveDeployments: true,
    }
  },
};
