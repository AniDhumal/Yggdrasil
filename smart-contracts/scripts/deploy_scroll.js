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
  console.log(`Eth Vault deployed to ${vault.target}`);
}

async function main() {
  const deployer_address = "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234";
  const scroll_vault = "0x4401de98fe700c5e2c62b2f2c6bed4aee135fc58";
  const scroll_weth = "0x5300000000000000000000000000000000000004";

  deployVault();

  const strategyManager = await hre.ethers.deployContract("StrategyManager");
  await strategyManager.waitForDeployment();
  console.log(`Strategy Manager deployed to ${strategyManager.target}`);

  const constructorParams = [scroll_weth, deployer_address, scroll_vault];
  const strategy_scroll = await hre.ethers.deployContract(
    "StrategyLinea",
    constructorParams
  );
  await strategy_scroll.waitForDeployment();
  console.log(`StrategyLinea deployed to ${strategy_scroll.target}`);
}

async function whitelist() {
  const manager = "0x08b59B9c3aAB242745f603F68eA6F992aaF473C0";
  const strategy = "0x5B7d72e1B7EDfF99153fE0b722548B154E7c86f1";
  const deployer_address = "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234";

  let managerInstance = await ethers.getContractAt("StrategyManager", manager);
  await managerInstance.whiteListStrategist(deployer_address);
  await managerInstance.queueWhiteListStrategy(strategy, deployer_address);
  await managerInstance.whiteListStrategy(strategy);
}
whitelist().catch((error) => {
  console.error(error);
  process.exit(1);
});
