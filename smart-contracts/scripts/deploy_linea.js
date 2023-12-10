const { ethers } = require("hardhat");

async function deployVault() {
  // Eth vault
  const constructorParams = [
    "0x2C1b868d6596a18e32E61B901E4060C872647b6C", // WETH
    "1",
    "1",
  ];

  const vault = await ethers.deployContract("ETHVault", constructorParams);
  await vault.waitForDeployment();
  console.log(`Eth Vault deployed to ${vault.target}`);
}

async function main() {
  const deployer_address = "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234";
  const linea_vault = "0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340";
  const linea_weth = "0x2C1b868d6596a18e32E61B901E4060C872647b6C";

  deployVault();

  const strategyManager = await hre.ethers.deployContract("StrategyManager");
  await strategyManager.waitForDeployment();
  console.log(`Strategy Manager deployed to ${strategyManager.target}`);

  const constructorParams = [linea_weth, deployer_address, linea_vault];
  const strategy_linea = await hre.ethers.deployContract(
    "StrategyLinea",
    constructorParams
  );
  await strategy_linea.waitForDeployment();
  console.log(`StrategyLinea deployed to ${strategy_linea.target}`);
}

async function whitelist() {
  const manager = "0x88c8627816361f1438C8D4C692647BbCc96FF50d";
  const strategy = "0x83EfCf6d2C4FD9ED637BF9da8dD19174308d532B";
  const deployer_address = "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234";
  // const linea_weth = "0x2C1b868d6596a18e32E61B901E4060C872647b6C";

  let managerInstance = await ethers.getContractAt("StrategyManager", manager);
  await managerInstance.whiteListStrategist(deployer_address);
  await managerInstance.queueWhiteListStrategy(strategy, deployer_address);
  await managerInstance.whiteListStrategy(strategy);
}

whitelist().catch((error) => {
  console.error(error);
  process.exit(1);
});
