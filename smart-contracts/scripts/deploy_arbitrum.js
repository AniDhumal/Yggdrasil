const { ethers } = require("hardhat");

// const hre = require("hardhat");

async function deployVault() {
  // Eth vault
  const constructorParams = [
    "0x4284186b053ACdBA28E8B26E99475d891533086a", // WETH
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
  const arbitrum_goerli_weth = "0x4284186b053ACdBA28E8B26E99475d891533086a";

  await deployVault();
  let arbitrum_goerli_vault = "0x08b59B9c3aAB242745f603F68eA6F992aaF473C0";

  const strategyManager = await hre.ethers.deployContract("StrategyManager");
  await strategyManager.waitForDeployment();
  console.log(`Strategy Manager deployed to ${strategyManager.target}`);

  const constructorParams = [
    arbitrum_goerli_weth,
    deployer_address,
    arbitrum_goerli_vault,
  ];
  const strategy_arbitrum = await hre.ethers.deployContract(
    "StrategyLinea",
    constructorParams
  );
  await strategy_arbitrum.waitForDeployment();
  console.log(`StrategyArbitrum deployed to ${strategy_arbitrum.target}`);
}

async function whitelist() {
  const manager = "0x19d12870077DDb6C53FbDeF6818ED504e63b23Ab";
  const strategy = "0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340";
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
