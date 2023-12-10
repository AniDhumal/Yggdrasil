require("@nomicfoundation/hardhat-toolbox");

// NEVER record important private keys in your code - this is for demo purposes

const { PRIVATE_KEY } = process.env;

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
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      accounts: [PRIVATE_KEY],
    },
    linea_testnet: {
      url: "https://linea-goerli.infura.io/v3/371af9d712614049b443043a9202cd6e",
      accounts: [PRIVATE_KEY],
    },
    linea_mainnet: {
      url: "https://rpc.linea.build/",
      accounts: [PRIVATE_KEY],
    },
    scrollTestnet: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [PRIVATE_KEY],
      minGasPrice: 10000000,
    },
    zkEVM_testnet: {
      url: "https://rpc.public.zkevm-test.net",
      accounts: [PRIVATE_KEY],
    },
    base_goerli: {
      url: "https://goerli.base.org",
      accounts: [PRIVATE_KEY],
      gasPrice: 1000000000,
    },
    mantleTest: {
      url: "https://rpc.testnet.mantle.xyz", // testnet
      accounts: [PRIVATE_KEY ?? ""],
    },
    // etherscan: {
    //   apiKey: {
    //     scrollSepolia: "abc",
    //   },
    //   customChains: [
    //     {
    //       network: "scrollSepolia",
    //       chainId: 534351,
    //       urls: {
    //         apiURL: "https://sepolia-blockscout.scroll.io/api",
    //         browserURL: "https://sepolia-blockscout.scroll.io/",
    //       },
    //     },
    //   ],
    // },
  },
};
