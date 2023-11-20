// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const erc20 = await hre.ethers.deployContract("CarMaintenanceLoyalty", ["ERC20LOYALTY", "ERC20OTO"]);

  await erc20.waitForDeployment();

  console.log(
    `CarMaintenanceLoyalty contract with deployed to ${erc20.target}`
  );

  const nft = await hre.ethers.deployContract("CarMaintenanceBook", [erc20.target]);

  await nft.waitForDeployment();

  console.log(
    `CarMaintenanceBook contract with ${erc20.target} for interface and deployed to ${nft.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
