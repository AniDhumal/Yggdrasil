require("@nomicfoundation/hardhat-toolbox");

// NEVER record important private keys in your code - this is for demo purposes
const GOERLI_TESTNET_PRIVATE_KEY =
  "cbc44f3dfb4047eb4e86a48a3278a3f48bebe0f953bb65ddeb982faa5a3a8bca";
const ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY = "";

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
  },
};
