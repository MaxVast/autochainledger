const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CarMaintenanceBook Test", function () {
    let owner, distributor, user, user2;
    let erc20Contract;
    let maintenanceContract;
    let tokenId;
    let hash;
    let uri;
    let maintenance;

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

        await erc20Contract.connect(owner).addAdmins(maintenanceContract.target)

        await maintenanceContract.connect(owner).setDistributor(distributor.address)

        tokenId = "VIN124858TEST";
        hash = await maintenanceContract.generateTokenId(tokenId)
        uri = "ipfs://QmHash123/"+hash+".json";
        maintenance = "Vidange";

        return { maintenanceContract, erc20Contract, owner, distributor, user, user2, tokenId, hash, uri, maintenance }
    }

    async function NftMintAndMaintenanceAddedFixture() {
        [owner, distributor, user, user2] = await ethers.getSigners();

        const Erc20Contract = await ethers.getContractFactory("CarMaintenanceLoyalty");
        erc20Contract = await Erc20Contract.deploy();

        const MaintenanceContract = await ethers.getContractFactory("CarMaintenanceBook");
        maintenanceContract = await MaintenanceContract.deploy(erc20Contract.target);

        await erc20Contract.connect(owner).addAdmins(maintenanceContract.target)

        await maintenanceContract.connect(owner).setDistributor(distributor.address)

        tokenId = "VIN124858TEST";
        hash = await maintenanceContract.generateTokenId(tokenId)
        uri = "ipfs://QmHash123/"+hash+".json";
        maintenance = "Vidange";

        await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
        await maintenanceContract.connect(distributor).addMaintenance(hash, maintenance);

        return { maintenanceContract, erc20Contract, owner, distributor, user, user2, tokenId, hash, uri, maintenance }
    }

    describe("Check Deploy Smart Contract", () => {
        beforeEach(async function () {
            const maintenanceContract = await loadFixture(deployFixture);
        });

        it("Check owner Smart Contract", async function () {
            assert.equal(await maintenanceContract.owner(), owner.address)
        });

        it("should not set a new address contract for the cagnotte if you are not the owner", async function () {
            const Erc20Contract2 = await ethers.getContractFactory("CarMaintenanceLoyalty");
            erc20Contract = await Erc20Contract2.deploy();
            await expect(maintenanceContract.connect(user).setCagnotteToken(erc20Contract.target))
                .to.be.revertedWithCustomError(maintenanceContract, "OwnableUnauthorizedAccount")
                .withArgs(user.address);
        });

        it("should set a new address contract for the cagnotte", async function () {
            const Erc20Contract2 = await ethers.getContractFactory("CarMaintenanceLoyalty");
            erc20Contract = await Erc20Contract2.deploy();
            await maintenanceContract.setCagnotteToken(erc20Contract.target)
            assert.equal(await maintenanceContract.cagnotteToken(), erc20Contract.target)
        });
    })

    describe("Check Distributor", () => {
        beforeEach(async function () {
            const maintenanceContract = await loadFixture(deployFixture);
        });

        it("should add an distributor", async function () {
            await expect(maintenanceContract.connect(owner).setDistributor(distributor.address))
                .to.emit(maintenanceContract, 'DistributorRegistered')
                .withArgs(distributor.address);
        });

        it("should not add an distributor if you are not the owner", async function () {
            await expect(maintenanceContract.connect(user).setDistributor(distributor.address))
                .to.be.revertedWithCustomError(maintenanceContract, "OwnableUnauthorizedAccount")
                .withArgs(user.address);
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
            await expect(maintenanceContract.connect(user).safeMint(user.address, hash, uri))
                .to.be.rejectedWith(maintenanceContract, "Not a distributor");
        });

        it("should mint a token and update cagnotte", async function () {
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
            await expect(maintenanceContract.connect(user).getTokenURI(hash))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should not get value lock token if the token doesnt exists", async function () {
            await expect(maintenanceContract.connect(user).locked(hash))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should not unlock token if you are not distributor", async function () {
            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await expect(maintenanceContract.connect(user).unlockToken(hash))
                .to.be.rejectedWith(maintenanceContract, "Not a distributor");
        });

        it("should unlock token ", async function () {
            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await expect(maintenanceContract.connect(distributor).unlockToken(hash))
                .to.emit(maintenanceContract, 'Unlocked')
                .withArgs(hash);
        });

        it("should unlock token if you are the owner", async function () {
            await maintenanceContract.safeMint(user.address, hash, uri);
            await expect(maintenanceContract.unlockToken(hash))
                .to.emit(maintenanceContract, 'Unlocked')
                .withArgs(hash);
        });

        it("should not unlock token if the token doesnt exists", async function () {
            await expect(maintenanceContract.connect(distributor).unlockToken(hash))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should not mint a token if is already exists", async function () {
            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await expect(maintenanceContract.connect(distributor).safeMint(user.address, hash, uri))
                .to.be.rejectedWith(maintenanceContract, "Token already claimed");
        });

        it("should not add an maintenance and update cagnotte if you are not distributor", async function () {
            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await expect(maintenanceContract.connect(user).addMaintenance(hash, maintenance))
                .to.be.rejectedWith(maintenanceContract, "Not a distributor");
        });

        it("should not add an maintenance and update cagnotte if the token doesnt exists", async function () {
            await expect(maintenanceContract.connect(distributor).addMaintenance(hash, maintenance))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should add an maintenance and update cagnotte", async function () {
            await maintenanceContract.connect(distributor).safeMint(user.address, hash, uri);
            await maintenanceContract.connect(distributor).addMaintenance(hash, maintenance);
            const cagnotteBalance = await erc20Contract.totalTokens(user.address);
            assert.equal(cagnotteBalance,1100);
        });
    })

    describe("Check Maintenance", () => {
        beforeEach(async function () {
            const maintenanceContract = await loadFixture(NftMintAndMaintenanceAddedFixture);
        });

        it("should not get maintenance history if the token doesnt exists", async function () {
            await expect(maintenanceContract.connect(user).getMaintenanceHistory(18722984123))
                .to.be.rejectedWith(maintenanceContract, "Token not exists")
        });

        it("should get maintenance history", async function () {
            const result = await maintenanceContract.connect(user).getMaintenanceHistory(hash)
            assert.equal(Array.isArray(result), true)
        });

        it("should not get number maintenance if the token doesnt exists", async function () {
            await expect(maintenanceContract.connect(user).getLengthMaintenanceHistory(18722984123))
                .to.be.rejectedWith(maintenanceContract, "Token not exists")
        });

        it("should get number maintenance", async function () {
            const result = await maintenanceContract.connect(user).getLengthMaintenanceHistory(hash)
            expect(result).to.be.greaterThan(0);
        });

        it("should not get an maintenance if the token doesnt exists", async function () {
            await expect(maintenanceContract.connect(user).gethMaintenanceHistoryById(18722984123,0 ))
                .to.be.rejectedWith(maintenanceContract, "Token not exists")
        });

        it("should get an maintenance", async function () {
            const result = await maintenanceContract.connect(user).gethMaintenanceHistoryById(hash, 0)
            assert.equal(Array.isArray(result), true)
        });
    })

    describe("Check transfer Token", () => {
        beforeEach(async function () {
            const maintenanceContract = await loadFixture(NftMintAndMaintenanceAddedFixture);
        });

        it("should not reclaim token if you are not an distributor", async function () {
            await expect(maintenanceContract.connect(user2).reclaimToken(user.address, hash))
                .to.be.rejectedWith(maintenanceContract, "Not a distributor");
        });

        it("should not reclaim token if the token not belong at user", async function () {
            await expect(maintenanceContract.connect(distributor).reclaimToken(user2.address, hash))
                .to.be.rejectedWith(maintenanceContract, "Token does not belong to the specified address");
        });

        it("should not reclaim token if the token doesnt exists", async function () {
            await expect(maintenanceContract.connect(distributor).reclaimToken(user.address, 18722984123))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should reclaim token", async function () {
            await maintenanceContract.connect(distributor).reclaimToken(user.address, hash)
            assert.equal(await maintenanceContract.locked(hash), false)
        });

        it("should not reclaim token if you are not an distributor", async function () {
            await expect(maintenanceContract.connect(user2).transferTokenNew(user.address, user2.address, hash))
                .to.be.rejectedWith(maintenanceContract, "Not a distributor");
        });

        it("should not reclaim token if the token not belong at user", async function () {
            await expect(maintenanceContract.connect(distributor).transferTokenNew(user2.address, user.address, hash))
                .to.be.rejectedWith(maintenanceContract, "Token does not belong to the specified address");
        });

        it("should not reclaim token if the token doesnt exists", async function () {
            await expect(maintenanceContract.connect(distributor).transferTokenNew(user.address, user2.address, 18722984123))
                .to.be.rejectedWith(maintenanceContract, "Token not exists");
        });

        it("should transfer token at new address", async function () {
            await maintenanceContract.connect(distributor).transferTokenNew(user.address, user2.address, hash)
            assert.equal(await maintenanceContract.ownerOf(hash), user2.address)
        });

        it("should not transferFrom token if is Lock", async function () {
            await expect(maintenanceContract.connect(distributor).transferFrom(user.address, user2.address, hash))
                .to.be.rejectedWith(maintenanceContract, "Token is locked");
        });

        it("should transferFrom token at new address", async function () {
            await maintenanceContract.connect(distributor).unlockToken(hash)
            await maintenanceContract.connect(user).approve(user2.address, hash)
            await expect(maintenanceContract.connect(user).transferFrom(user.address, user2.address, hash))
                .to.emit(maintenanceContract, "Transfer")
                .withArgs(user.address, user2.address, hash);
            assert.equal(await maintenanceContract.ownerOf(hash), user2.address)
        });

        it("should not safeTransferFrom token if is Lock", async function () {
            await expect(maintenanceContract.connect(distributor).safeTransferFrom(user.address, user2.address, hash))
                .to.be.rejectedWith(maintenanceContract, "Token is locked");
        });

        it("should safeTransferFrom token at new address", async function () {
            await maintenanceContract.connect(distributor).unlockToken(hash)
            await maintenanceContract.connect(user).approve(user2.address, hash)
            await expect(maintenanceContract.connect(user).safeTransferFrom(user.address, user2.address, hash))
                .to.emit(maintenanceContract, "Transfer")
                .withArgs(user.address, user2.address, hash);
            assert.equal(await maintenanceContract.ownerOf(hash), user2.address)
        });
    })
})
