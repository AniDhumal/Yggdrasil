const { ethers } = require("hardhat");


async function main() {
    // const aaveLP = "0xb591802405cce79fC9CD163fF04D201FE5CB5aAf";
    // const offchain = "0xb591802405cce79fC9CD163fF04D201FE5CB5aAf";//needs to be configed
    // const baseToken = "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747";
    // const marketToken = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
    // const aToken = "0xAba444af64ad33A6d8575b8A353226997d6A126a";
    // const strategyManager = await ethers.deployContract("StrategyManager");
    // await strategyManager.waitForDeployment();
    // console.log(`Strategy Manager deployed to ${strategyManager.target}`);

    const WMATIC = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
    const Wbtc = "0x0d787a4a1548f673ed375445535a6c7A1EE56180";
    const UniswapRouterV3 = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
    const aaveLP = "0xb591802405cce79fC9CD163fF04D201FE5CB5aAf"
    const strategyManager = "0xB7e797FEC988791daa024549d29dadD29213755E";
    const _aBTC = "0xdA67e6C1171D4f0D522Db7f127B88405eA1535d4";
    const constructorParams = [WMATIC, Wbtc, UniswapRouterV3, aaveLP, strategyManager, _aBTC];
    const strategy3 = await ethers.deployContract("Strategy3", constructorParams);
    await strategy3.waitForDeployment();
    console.log(`Strat 3 deployed to ${strategy3.target}`);



}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
