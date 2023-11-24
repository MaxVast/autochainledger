const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CarMaintenanceLoyalty Test", function () {
  let owner, admin, user;
  let erc20Contract;

  async function deployFixture() {
    [owner, admin, user] = await ethers.getSigners();

    erc20Contract = await ethers.deployContract("CarMaintenanceLoyalty");

    return { erc20Contract, owner, admin, user }
  }

  async function adminAddedFixture() {
    [owner, admin, user] = await ethers.getSigners();

    erc20Contract = await ethers.deployContract("CarMaintenanceLoyalty");
    await erc20Contract.connect(owner).addAdmin(admin.address);

    return { erc20Contract, owner, admin, user }
  }
  
  describe("Check Admin", () => { 
    beforeEach(async function () {
      const erc20Contract = await loadFixture(deployFixture);
    });

    it("should add an admin", async function () {
      await erc20Contract.connect(owner).addAdmin(admin.address);
    });
  
    it("should remove an admin", async function () {
      await erc20Contract.connect(owner).removeAdmin(admin.address);
    });
  })

  describe("Check Cagnotte", () => { 
    beforeEach(async function () {
      const erc20Contract = await loadFixture(adminAddedFixture);
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
  
    it("should mint tokens for an account", async function () {
      const amount = 100;
      await erc20Contract.connect(admin).addCagnotte(user.address, amount);
      await erc20Contract.connect(admin).mint(user.address);
      expect(await erc20Contract.balanceOf(user.address)).to.equal(amount);
    });
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
