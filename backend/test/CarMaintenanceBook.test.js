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

        return { maintenanceContract, owner, distributor, user, user2 }
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
})