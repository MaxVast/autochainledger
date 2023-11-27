const hre = require("hardhat");

async function main() {

  const erc20 = await hre.ethers.deployContract("CarMaintenanceLoyalty");

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
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
