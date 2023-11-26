const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CarMaintenanceLoyalty Test", function () {
  let owner, admin, user;
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
    await erc20Contract.connect(owner).addAdmin(admin.address);

    return { erc20Contract, owner, admin, user }
  }
  
  describe("Check Admin", () => { 
    beforeEach(async function () {
      const erc20Contract = await loadFixture(deployFixture);
    });

    it("should not add an admin if it's not owner", async function () {
      await expect(erc20Contract.connect(user).addAdmin(admin.address))
        .to.be.revertedWithCustomError(erc20Contract, "OwnableUnauthorizedAccount")
        .withArgs(user.address);
    });

    it("should add an admin", async function () {
      await expect(erc20Contract.connect(owner).addAdmin(admin.address))
        .to.emit(erc20Contract, 'AdminAdded')
        .withArgs(admin.address);
    });

    it("should not remove an admin if it's not owner", async function () {
      await erc20Contract.connect(owner).addAdmin(admin.address);
      await expect(erc20Contract.connect(user).removeAdmin(admin.address))
        .to.be.revertedWithCustomError(erc20Contract, "OwnableUnauthorizedAccount")
        .withArgs(user.address);
    });
  
    it("should remove an admin", async function () {
      await erc20Contract.connect(owner).addAdmin(admin.address);
      await expect(erc20Contract.connect(owner).removeAdmin(admin.address))
        .to.emit(erc20Contract, 'AdminRemoved')
        .withArgs(admin.address);
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
      expect(await erc20Contract.balanceOf(user.address)).to.equal(amount);
    });

    it("should return the correct balance for an account", async function () {
      const amount = 100;
      await erc20Contract.connect(admin).addCagnotte(user.address, amount);
      
      const balance = await erc20Contract.balanceOf(user.address);
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
      assert.equal(await erc20Contract.balanceOf(user.address), 0);
    });
  })

  describe("Check Transfer SafeErc20", () => { 
    it("devrait transférer des fonds en toute sécurité", async function () {
      const initialBalance = await erc20Contract.balanceOf(user.address);
      const amount = 100;
      await erc20Contract.connect(admin).addCagnotte(user.address, amount);
      await erc20Contract.safeTransfer(user.address, amount);
      const newBalance = await erc20Contract.balanceOf(user.address);
  
      expect(newBalance).to.equal(amount);
    });
  
    /*it("devrait transférer des fonds de manière sécurisée depuis une adresse spécifiée", async function () {
      // Effectuez un transfert depuis user1 vers user2 et vérifiez le solde du destinataire
      const initialBalance = await erc20Contract.balanceOf(user.address);
      const amount = 50;
      await erc20Contract.safeTransferFrom(user.address, user.address, amount);
      const newBalance = await erc20Contract.balanceOf(user.address);
  
      expect(newBalance).to.equal(amount);
    });*/
  })
})

  /*
  it("should return correct balance using balanceOf", async function () {
    const initialBalance = 100;
    await erc20Contract.connect(admin).addCagnotte(user.address, initialBalance);

    // Utilisez la fonction balanceOf pour obtenir le solde
    const userBalance = await erc20Contract.balanceOf(user.address);
    expect(userBalance).to.equal(initialBalance);

    // Ajoutez des tokens supplémentaires et vérifiez à nouveau le solde
    const additionalTokens = 50;
    await erc20Contract.connect(admin).addCagnotte(user.address, additionalTokens);

    const updatedBalance = await erc20Contract.balanceOf(user.address);
    expect(updatedBalance).to.equal(initialBalance + additionalTokens);
  });

  it("should transfer tokens safely", async function () {
    const amount = 100;
    await erc20Contract.connect(admin).addCagnotte(user.address, amount);
    await erc20Contract.connect(admin).mint(user.address);

    const receiverBalanceBefore = await token.balanceOf(user.address);

    // Test de safeTransfer
    await erc20Contract.connect(user).safeTransfer(admin.address, amount);
    let receiverBalanceAfter = await erc20Contract.balanceOf(user.address);
    expect(receiverBalanceAfter).to.equal(receiverBalanceBefore - amount);

    // Test de safeTransferFrom
    await erc20Contract.connect(admin).addCagnotte(owner.address, amount);
    await erc20Contract.connect(owner).safeIncreaseAllowance(user.address, amount);
    await erc20Contract.connect(user).safeTransferFrom(owner.address, admin.address, amount);
    receiverBalanceAfter = await erc20Contract.balanceOf(admin.address);
    expect(receiverBalanceAfter).to.equal(amount);

    // Test de safeIncreaseAllowance
    const spender = admin.address;
    const allowanceBefore = await erc20Contract.allowance(owner.address, spender);
    await erc20Contract.connect(owner).safeIncreaseAllowance(spender, amount);
    const allowanceAfter = await erc20Contract.allowance(owner.address, spender);
    expect(allowanceAfter).to.equal(allowanceBefore + amount);

    // Test de safeDecreaseAllowance
    const requestedDecrease = amount;
    await erc20Contract.connect(owner).safeDecreaseAllowance(spender, requestedDecrease);
    const allowanceAfterDecrease = await erc20Contract.allowance(owner.address, spender);
    expect(allowanceAfterDecrease).to.equal(allowanceAfter - requestedDecrease);

    // Test de forceApprove
    const newAllowance = 500;
    await erc20Contract.connect(owner).forceApprove(spender, newAllowance);
    const allowanceAfterForceApprove = await erc20Contract.allowance(owner.address, spender);
    expect(allowanceAfterForceApprove).to.equal(newAllowance);
  })

})*/
