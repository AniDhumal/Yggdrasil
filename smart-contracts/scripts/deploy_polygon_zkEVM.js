const { ethers } = require("hardhat");

// const hre = require("hardhat");

async function deployVault() {
  // Eth vault
  const constructorParams = [
    "0x2ad78787CCaf7FA8FAe8953FD78ab9163f81DcC8", // WETH
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
  const polygon_weth = "0x2ad78787CCaf7FA8FAe8953FD78ab9163f81DcC8";

  await deployVault();
  let polygon_vault = "0x83E6B164C6D130567316cECF3Bc7879203772943";

  const strategyManager = await hre.ethers.deployContract("StrategyManager");
  await strategyManager.waitForDeployment();
  console.log(`Strategy Manager deployed to ${strategyManager.target}`);

  const constructorParams = [polygon_weth, deployer_address, polygon_vault];
  const strategy_polygon = await hre.ethers.deployContract(
    "StrategyLinea",
    constructorParams
  );
  await strategy_polygon.waitForDeployment();
  console.log(`Strategypolygon deployed to ${strategy_polygon.target}`);
}

async function whitelist() {
  const manager = "0x938c795358fD433aDdbd1374eCe2aD69D61a31F2";
  const strategy = "0xD54c7403F7f5c2dFEA07669C6b9b52F6bdc21AE5";
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
