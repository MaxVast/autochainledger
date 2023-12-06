const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CarMaintenanceLoyalty Test", function () {
  let owner, admin, user;
  let maintenanceContract;
  let erc20Contract;

  async function deployFixture() {
    [owner, admin, user] = await ethers.getSigners();

    const Erc20Contract = await ethers.getContractFactory("CarMaintenanceLoyalty");
    erc20Contract = await Erc20Contract.deploy();

    return { erc20Contract, owner, admin, user }
  }

  async function adminAddedFixture() {
    [owner, admin, user] = await ethers.getSigners();

    const Erc20Contract = await ethers.getContractFactory("CarMaintenanceLoyalty");
    erc20Contract = await Erc20Contract.deploy();
    const MaintenanceContract = await ethers.getContractFactory("CarMaintenanceBook");
    maintenanceContract = await MaintenanceContract.deploy(erc20Contract.target);
    await erc20Contract.connect(owner).addAdmins(maintenanceContract.target);
    await erc20Contract.connect(owner).addAdmins(admin.address);

    return { erc20Contract, owner, admin, user }
  }

  describe("Check Deploy Smart Contract", () => {
    beforeEach(async function () {
      const maintenanceContract = await loadFixture(deployFixture);
    });

    it("Check owner Smart Contract", async function () {
      assert.equal(await erc20Contract.owner(), owner.address)
    });
  })
  
  describe("Check Admin", () => { 
    beforeEach(async function () {
      const erc20Contract = await loadFixture(deployFixture);
    });

    it("should not add an admin if it's not owner", async function () {
      await expect(erc20Contract.connect(user).addAdmins(admin.address))
        .to.be.revertedWithCustomError(erc20Contract, "OwnableUnauthorizedAccount")
        .withArgs(user.address);
    });

    it("should add an admin", async function () {
      await expect(erc20Contract.addAdmins(admin.address))
        .to.emit(erc20Contract, 'AdminAdded')
        .withArgs(admin.address);
    });

    it("should not add an admin if is already added", async function () {
      await erc20Contract.addAdmins(admin.address);
      await expect(erc20Contract.addAdmins(admin.address))
          .to.be.rejectedWith(erc20Contract, "Admin already registered");
    });

    it("should not remove an admin if it's not owner", async function () {
      await erc20Contract.addAdmins(admin.address);
      await expect(erc20Contract.connect(user).removeAdmins(admin.address))
        .to.be.revertedWithCustomError(erc20Contract, "OwnableUnauthorizedAccount")
        .withArgs(user.address);
    });
  
    it("should remove an admin", async function () {
      await erc20Contract.addAdmins(admin.address);
      await expect(erc20Contract.removeAdmins(admin.address))
        .to.emit(erc20Contract, 'AdminRemoved')
        .withArgs(admin.address);
    });

    it("should not add an admin if is already added", async function () {
      await erc20Contract.addAdmins(admin.address);
      await erc20Contract.removeAdmins(admin.address)
      await expect(erc20Contract.removeAdmins(admin.address))
          .to.be.rejectedWith(erc20Contract, "Admin already removed");
    });
  })

  describe("Check Cagnotte", () => { 
    beforeEach(async function () {
      const erc20Contract = await loadFixture(adminAddedFixture);
    });

    it("should not add cagnotte if it's not an admin", async function () {
      await expect(erc20Contract.connect(user).addCagnotte(user.address, 1000))
        .to.be.rejectedWith(erc20Contract, "You are not a admins");
    });

    it("should add cagnotte for an account", async function () {
      const amount = 100;
      await erc20Contract.connect(admin).addCagnotte(user.address, amount);
      expect(await erc20Contract.totalTokens(user.address)).to.equal(amount);
    });

    it("should return the correct balance for an account", async function () {
      const amount = 100;
      await erc20Contract.connect(admin).addCagnotte(user.address, amount);
      
      const balance = await erc20Contract.totalTokens(user.address);
      assert.equal(balance, amount);
    });

    it("should not mint cagnotte if it's not an admin", async function () {
      const amount = 100;
      await erc20Contract.connect(admin).addCagnotte(user.address, amount);

      await expect(erc20Contract.connect(user).mint(user.address))
        .to.be.rejectedWith(erc20Contract, "You are not a admins");
    });

    it("should not mint tokens if balance is empty", async function () {
      await expect(erc20Contract.connect(admin).mint(user.address))
        .to.be.rejectedWith(
          erc20Contract, "Account balance is insufficient for minting");
    });
  
    it("should mint tokens for an account", async function () {
      const amount = 100;
      await erc20Contract.connect(admin).addCagnotte(user.address, amount);
      await expect(erc20Contract.connect(admin).mint(user.address))
        .to.emit(erc20Contract, 'PrizePoolDelivered')
        .withArgs(user.address);
      assert.equal(await erc20Contract.balanceOf(user.address), amount);
    });
  })
})
