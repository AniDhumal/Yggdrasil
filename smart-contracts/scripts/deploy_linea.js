const { ethers } = require("hardhat");

// const hre = require("hardhat");

async function deployVault() {
  // Eth vault
  const constructorParams = [
    "0x2C1b868d6596a18e32E61B901E4060C872647b6C", // WETH
    "1",
    "1",
  ];

  const vault = await ethers.deployContract("ETHVault", constructorParams);
  console.log(vault);
  await vault.waitForDeployment();
  console.log(`Eth Vault deployed to ${vault.target}`);
}

async function main() {
  // const strategyManager = await hre.ethers.deployContract("StrategyManager");
  // await strategyManager.waitForDeployment();
  // console.log(`Strategy Manager deployed to ${strategyManager.target}`);

  deployVault();
  //   const constructorParams = [
  //     "0x4284186b053ACdBA28E8B26E99475d891533086a", // WETH
  //     "0x1377b75237a9ee83aC0C76dE258E68e875d96334", // WBTC
  //     "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD", // UniSwapRouter
  //     "0x8d284fE251BB7Fe6B529FC2f27BAb415FcF46B25", // Lending pool aave
  //     "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234", // Strategy Manager
  //     "0x65Ae5B31CDC763F58cc70fC8780E07DEBccB4D4e", // aBTC
  //   ];
  //   const strategy3 = await hre.ethers.deployContract(
  //     "Strategy3",
  //     constructorParams
  //   );
  //   await strategy3.waitForDeployment();
  //   console.log(`Strategy3 deployed to ${strategy3.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
