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

  // deployVault();

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

async function whitelist() {
  const manager = "0x88c8627816361f1438C8D4C692647BbCc96FF50d";
  const strategy = "0x83EfCf6d2C4FD9ED637BF9da8dD19174308d532B";
  const deployer_address = "0xDB8fbe9ddF3316F08CE6a82835C1F06d3a80b234";
  // const linea_weth = "0x2C1b868d6596a18e32E61B901E4060C872647b6C";

  let managerInstance = await ethers.getContractAt("StrategyManager", manager);
  // await managerInstance.whiteListStrategist(deployer_address);
  // await managerInstance.queueWhiteListStrategy(strategy, deployer_address);
  // await managerInstance.whiteListStrategy(strategy);
  // let strategyInstance = await ethers.getContractAt("StrategyLinea", strategy);
  // let weth = await ethers.getContractAt("IERC20", linea_weth);
  // await weth.deposit({ value: ethers.parseEther("0.02") });

  // let tx = await strategyInstance.invest(
  //   deployer_address,
  //   "10000000000000000",
  //   { value: ethers.parseEther("0.01") }
  // );
  // console.log("tx", tx);
  // await tx.wait();

  // let vault_address = "0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340";
  // let vault = await ethers.getContractAt("ETHVault", vault_address);
  // await vault.approve(strategy, "9000000000000000");

  // let result = await vault.maxRedeem(deployer_address);
  // let result = weth.balanceOf(deployer_address);
  // console.log(result);
  // let tx = await strategyInstance.divest(deployer_address, "9000000000000000");
  // console.log("tx", tx);
  // await tx.wait();
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
