const { ethers } = require("hardhat");

// const hre = require("hardhat");

async function deployVault() {
  // Eth vault
  const constructorParams = [
    "0x4200000000000000000000000000000000000006", // WETH
    "1",
    "1",
  ];

  const vault = await ethers.deployContract("ETHVault", constructorParams);
  await vault.waitForDeployment();
  console.log(`Eth Vault deployed to ${vault.target}`);
  return vault.target;
}

async function main() {
  const deployer_address = "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234";
  const base_weth = "0x4200000000000000000000000000000000000006";

  await deployVault();
  let base_vault = "0x938c795358fD433aDdbd1374eCe2aD69D61a31F2";

  const strategyManager = await hre.ethers.deployContract("StrategyManager");
  await strategyManager.waitForDeployment();
  console.log(`Strategy Manager deployed to ${strategyManager.target}`);

  const constructorParams = [base_weth, deployer_address, base_vault];
  const strategy_base = await hre.ethers.deployContract(
    "StrategyLinea",
    constructorParams
  );
  await strategy_base.waitForDeployment();
  console.log(`Strategybase deployed to ${strategy_base.target}`);
}

async function whitelist() {
  const manager = "0xD54c7403F7f5c2dFEA07669C6b9b52F6bdc21AE5";
  const strategy = "0x4401DE98fE700c5E2c62b2f2C6BeD4AEE135fC58";
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
