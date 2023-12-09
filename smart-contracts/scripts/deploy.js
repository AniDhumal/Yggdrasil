const hre = require("hardhat");

async function main() {
  const strategyManager = await hre.ethers.deployContract("StrategyManager");
  await strategyManager.waitForDeployment();
  console.log(`Cupcake vending machine deployed to ${strategyManager.target}`);

  // const constructorParams = [];
  // const strategy3 = await hre.ethers.deployContract("Strategy3");
  // await strategy3.waitForDeployment();
  // console.log(`Cupcake vending machine deployed to ${strategy3.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
