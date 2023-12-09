const { Contract } = require("ethers");
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
  await vault.waitForDeployment();
  console.log(`Eth Vault deployed to ${vault.target}`);
}

async function main() {
  const deployer_address = "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234";
  const linea_vault = "0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340";
  const linea_weth = "0x4284186b053ACdBA28E8B26E99475d891533086a";

  // deployVault();

  // const strategyManager = await hre.ethers.deployContract("StrategyManager");
  // await strategyManager.waitForDeployment();
  // console.log(`Strategy Manager deployed to ${strategyManager.target}`);

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
  const strategy = "0xa2746dcD4F45FAF612350bC2D3adD6C0a36e9eA5";
  const deployer_address = "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234";

  let managerInstance = await ethers.getContractAt("StrategyManager", manager);
  // await managerInstance.whiteListStrategist(deployer_address);
  // await managerInstance.queueWhiteListStrategy(strategy, deployer_address);
  // await managerInstance.whiteListStrategy(strategy);
  let strategyInstance = await ethers.getContractAt("StrategyLinea", strategy);

  let tx = await strategyInstance.invest(deployer_address, "0", {
    value: ethers.parseEther("0.01"),
    // gasLimit: fee,
  });
  console.log("tx", tx);
  await tx.wait();
}

async function testVault() {
  let vault_address = "0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340";
  let vault = await ethers.getContractAt("ETHVault", vault_address);

  let deployer_address = "0xdb8fbe9ddf3316f08ce6a82835c1f06d3a80b234";

  // await vault.deposit(
  //   ethers.parseEther("0.02"),
  //   "0xdb8fbe9ddf3316f08ce6a82835c1f06d3a80b234"
  // );
  await vault.redeem(
    ethers.parseEther("0.02"),
    deployer_address,
    deployer_address
  );
}

whitelist().catch((error) => {
  console.error(error);
  process.exit(1);
});
