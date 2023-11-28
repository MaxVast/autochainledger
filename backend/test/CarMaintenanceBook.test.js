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

    describe("Check mint NFT and Maintenance", () => {
        beforeEach(async function () {
            const maintenanceContract = await loadFixture(distributorAddedFixture);
        });

        it("should not mint a token if you are not distributor", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId)
            const uri = "ipfs://QmHash123/"+hash+".json";
            await expect(maintenanceContract.connect(user).safeMint(user.address, hash, uri))
                .to.be.rejectedWith(maintenanceContract, "Not a distributor");
        });

        it("should mint a token and update cagnotte", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId)
            const uri = "ipfs://QmHash123/"+hash+".json";
            // Mint a token
            await expect(maintenanceContract.connect(distributor).safeMint(user.address, hash, uri))
                .to.emit(maintenanceContract, 'TokenClaimed')
                .withArgs(user.address, hash);
            // Check if the token exists
            const tokenExists = await maintenanceContract.ownerOf(hash);
            // Check token properties
            const lockedStatus = await maintenanceContract.locked(hash);
            const tokenURI = await maintenanceContract.getTokenURI(hash);
            // Check cagnotte balance
            const cagnotteBalance = await erc20Contract.totalTokens(user.address);
            // Assertions
            assert.equal(tokenExists, user.address);
            assert.equal(lockedStatus,true);
            assert.equal(tokenURI, uri);
            assert.equal(cagnotteBalance,1000);
        });

        it("should not get token URI if the token doesnt exists", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId)

            await expect(maintenanceContract.connect(user).getTokenURI(hash))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should not get value lock token if the token doesnt exists", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId)

            await expect(maintenanceContract.connect(user).locked(hash))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should not unlock token if you are not distributor", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId)
            const uri = "ipfs://QmHash123/"+hash+".json";

            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await expect(maintenanceContract.connect(user).unlockToken(hash))
                .to.be.rejectedWith(maintenanceContract, "Not a distributor");
        });

        it("should not unlock token if the token doesnt exists", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId)

            await expect(maintenanceContract.connect(distributor).unlockToken(hash))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should not mint a token if is already exists", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId)
            const uri = "ipfs://QmHash123/"+hash+".json";

            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await expect(maintenanceContract.connect(distributor).safeMint(user.address, hash, uri))
                .to.be.rejectedWith(maintenanceContract, "Token already claimed");
        });

        it("should not add an maintenance and update cagnotte if you are not distributor", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId);
            const uri = "ipfs://QmHash123/"+hash+".json";
            const maintenance = "Vidange";
            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await expect(maintenanceContract.connect(user).addMaintenance(hash, maintenance))
                .to.be.rejectedWith(maintenanceContract, "Not a distributor");
        });

        it("should not add an maintenance and update cagnotte if the token doesnt exists", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId);
            const maintenance = "Vidange";
            await expect(maintenanceContract.connect(distributor).addMaintenance(hash, maintenance))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should add an maintenance and update cagnotte", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId);
            const uri = "ipfs://QmHash123/"+hash+".json";
            const maintenance = "Vidange"

            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await maintenanceContract.connect(distributor).addMaintenance(hash, maintenance);
            const cagnotteBalance = await erc20Contract.totalTokens(user.address);
            assert.equal(cagnotteBalance,1100);
        });

        it("should get maintenance history", async function () {
            const tokenId = "VIN124858TEST";
            const hash = await maintenanceContract.generateTokenId(tokenId);
            const uri = "ipfs://QmHash123/"+hash+".json";
            const maintenance = "Vidange"

            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await maintenanceContract.connect(distributor).addMaintenance(hash, maintenance);
            const result = await maintenanceContract.connect(user).getMaintenanceHistory(hash)

            assert.equal(Array.isArray(result), true)
        });


    })
})
