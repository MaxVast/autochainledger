const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CarMaintenanceBook Test", function () {
    let owner, distributor, user, user2;
    let erc20Contract;
    let maintenanceContract;

    async function deployFixture() {
        [owner, distributor, user, user2] = await ethers.getSigners();

        const Erc20Contract = await ethers.getContractFactory("CarMaintenanceLoyalty");
        erc20Contract = await Erc20Contract.deploy();

        const MaintenanceContract = await ethers.getContractFactory("CarMaintenanceBook");
        maintenanceContract = await MaintenanceContract.deploy(erc20Contract.target);

        return { maintenanceContract, erc20Contract, owner, distributor, user, user2 }
    }

    async function distributorAddedFixture() {
        [owner, distributor, user, user2] = await ethers.getSigners();

        const Erc20Contract = await ethers.getContractFactory("CarMaintenanceLoyalty");
        erc20Contract = await Erc20Contract.deploy();

        const MaintenanceContract = await ethers.getContractFactory("CarMaintenanceBook");
        maintenanceContract = await MaintenanceContract.deploy(erc20Contract.target);

        await erc20Contract.connect(owner).addAdmin(maintenanceContract.target)

        await maintenanceContract.connect(owner).setDistributor(distributor.address)

        return { maintenanceContract, erc20Contract, owner, distributor, user, user2 }
    }

    describe("Check Distributor", () => {
        beforeEach(async function () {
            const maintenanceContract = await loadFixture(deployFixture);
        });

        it("should add an distributor", async function () {
            await expect(maintenanceContract.connect(owner).setDistributor(distributor.address))
                .to.emit(maintenanceContract, 'DistributorRegistered')
                .withArgs(distributor.address);
        });

        it("should not add an distributor already registered", async function () {
            await maintenanceContract.connect(owner).setDistributor(distributor.address)
            await expect(maintenanceContract.connect(owner).setDistributor(distributor.address))
                .to.be.rejectedWith(maintenanceContract, "Distributor is already registered");
        });
    })

    describe("Check mint", () => {
        beforeEach(async function () {
            const maintenanceContract = await loadFixture(distributorAddedFixture);
        });


        it("should mint a token and update cagnotte", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId)
            const uri = "ipfs://QmHash123/"+hash+".json";

            // Mint a token
            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);

            // Check if the token exists
            const tokenExists = await maintenanceContract.ownerOf(hash);

            // Check token properties
            const lockedStatus = await maintenanceContract.locked(hash);
            const tokenURI = await maintenanceContract.getTokenURI(hash);

            // Check cagnotte balance
            const cagnotteBalance = await erc20Contract.totalTokens(user.address);

            // Assertions
            expect(tokenExists).to.equal(user.address);
            expect(lockedStatus).to.equal(true);
            expect(tokenURI).to.equal(uri);
            expect(cagnotteBalance).to.equal(1000);
        });

        it("should add an maintenance and update cagnotte", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId)
            const uri = "ipfs://QmHash123/"+tokenId+".json";

            /*// Mint a token
            await maintenanceContract.connect(distributor).addMaintenance(user.address, hash, uri);

            // Check if the token exists
            const tokenExists = await maintenanceContract.ownerOf(hash);

            // Check token properties
            const lockedStatus = await maintenanceContract.locked(hash);
            const tokenURI = await maintenanceContract.getTokenURI(hash);

            // Check cagnotte balance
            const cagnotteBalance = await erc20Contract.totalTokens(user.address);

            // Assertions
            expect(tokenExists).to.equal(user.address);
            expect(lockedStatus).to.equal(true);
            expect(tokenURI).to.equal(uri);
            expect(cagnotteBalance).to.equal(1000);*/
        });
    })
})