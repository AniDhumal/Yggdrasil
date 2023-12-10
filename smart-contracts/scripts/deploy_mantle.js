const { ethers } = require("hardhat");

async function deployVault() {
  // Eth vault
  const constructorParams = [
    "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111", // WETH
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
  const mantle_weth = "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111";

  await deployVault();
  let mantle_vault = "0x83E6B164C6D130567316cECF3Bc7879203772943";

  const strategyManager = await hre.ethers.deployContract("StrategyManager");
  await strategyManager.waitForDeployment();
  console.log(`Strategy Manager deployed to ${strategyManager.target}`);

  const constructorParams = [mantle_weth, deployer_address, mantle_vault];
  const strategy_mantle = await hre.ethers.deployContract(
    "StrategyMantle",
    constructorParams
  );
  await strategy_mantle.waitForDeployment();
  console.log(`Strategymantle deployed to ${strategy_mantle.target}`);
}

async function whitelist() {
  const manager = "0x938c795358fD433aDdbd1374eCe2aD69D61a31F2";
  const strategy = "0x439f7f12Ee3b5D8F51D02019C4501fb2d84054f0";
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
