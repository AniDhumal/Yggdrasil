const hre = require("hardhat");

async function main() {
    const strategyManager = await hre.ethers.deployContract("StrategyManager");
    await strategyManager.waitForDeployment();
    console.log(`Strategy Manager deployed to ${strategyManager.target}`);

    const constructorParams = [];
    const strategy3 = await hre.ethers.deployContract("Strategy2");
    await strategy3.waitForDeployment();
    console.log(`Strat 2 deployed to ${strategy2.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
