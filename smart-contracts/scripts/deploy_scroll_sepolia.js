const { ethers } = require("hardhat");

// const hre = require("hardhat");

async function deployVault() {
  // Eth vault
  const constructorParams = [
    "0x5300000000000000000000000000000000000004", // WETH
    "1",
    "1",
  ];

  const vault = await ethers.deployContract("ETHVault", constructorParams);
  await vault.waitForDeployment();
  console.log(`Scroll Eth Vault deployed to ${vault.target}`);
  return vault.target;
}

async function main() {
  const deployer_address = "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234";
  const scroll_weth = "0x5300000000000000000000000000000000000004";

  // const scroll_vault = await deployVault();

  // const strategyManager = await hre.ethers.deployContract("StrategyManager");
  // await strategyManager.waitForDeployment();
  // console.log(`Strategy Manager deployed to ${strategyManager.target}`);

  const constructorParams = [scroll_weth, deployer_address, scroll_vault];
  const strategy_scroll = await hre.ethers.deployContract(
    "StrategyLinea",
    constructorParams
  );
  await strategy_scroll.waitForDeployment();
  console.log(`StrategyLinea deployed to ${strategy_scroll.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
