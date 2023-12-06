// scripts/addAdmin.js
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

    const carMaintenanceBook = await hre.ethers.getContractFactory("CarMaintenanceBook");
    const contract = carMaintenanceBook.attach(contractAddress)


    try {
        await contract.setDistributor('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
        await contract.setDistributor('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC');
        await contract.setDistributor('0x90F79bf6EB2c4f870365E785982E1f101E93b906');
        await contract.setDistributor('0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65');
    } catch(error) {
        console.log(error)
    }
    console.log('Distributor added successfully!');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
