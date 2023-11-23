const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("CarMaintenanceLoyalty", function () {
  let owner, admin, user;
  let token;

  beforeEach(async function () {
    [owner, admin, user] = await ethers.getSigners();

    // Déployez le contrat
    const Token = await ethers.getContractFactory("CarMaintenanceLoyalty");
    token = await Token.deploy();
    await token.deployed();

    // Ajoutez un admin
    await token.addAdmin(admin.address);
  });

  it("should add an admin", async function () {
    await token.connect(owner).addAdmin(user.address);
    expect(await token.admins(user.address)).to.equal(true);
  });

  it("should remove an admin", async function () {
    await token.connect(owner).removeAdmin(admin.address);
    expect(await token.admins(admin.address)).to.equal(false);
  });

  it("should add cagnotte for an account", async function () {
    const amount = 100;
    await token.connect(admin).addCagnotte(user.address, amount);
    expect(await token.totalTokens(user.address)).to.equal(amount);
  });

  it("should mint tokens for an account", async function () {
    const amount = 100;
    await token.connect(admin).addCagnotte(user.address, amount);
    await token.connect(admin).mint(user.address);
    expect(await token.balanceOf(user.address)).to.equal(amount);
  });

  it("should return correct balance using balanceOf", async function () {
    const initialBalance = 100;
    await token.connect(admin).addCagnotte(user.address, initialBalance);

    // Utilisez la fonction balanceOf pour obtenir le solde
    const userBalance = await token.balanceOf(user.address);
    expect(userBalance).to.equal(initialBalance);

    // Ajoutez des tokens supplémentaires et vérifiez à nouveau le solde
    const additionalTokens = 50;
    await token.connect(admin).addCagnotte(user.address, additionalTokens);

    const updatedBalance = await token.balanceOf(user.address);
    expect(updatedBalance).to.equal(initialBalance + additionalTokens);
  });

  it("should transfer tokens safely", async function () {
    const amount = 100;
    await token.connect(admin).addCagnotte(user.address, amount);
    await token.connect(admin).mint(user.address);

    const receiverBalanceBefore = await token.balanceOf(user.address);

    // Test de safeTransfer
    await token.connect(user).safeTransfer(admin.address, amount);
    let receiverBalanceAfter = await token.balanceOf(user.address);
    expect(receiverBalanceAfter).to.equal(receiverBalanceBefore - amount);

    // Test de safeTransferFrom
    await token.connect(admin).addCagnotte(owner.address, amount);
    await token.connect(owner).safeIncreaseAllowance(user.address, amount);
    await token.connect(user).safeTransferFrom(owner.address, admin.address, amount);
    receiverBalanceAfter = await token.balanceOf(admin.address);
    expect(receiverBalanceAfter).to.equal(amount);

    // Test de safeIncreaseAllowance
    const spender = admin.address;
    const allowanceBefore = await token.allowance(owner.address, spender);
    await token.connect(owner).safeIncreaseAllowance(spender, amount);
    const allowanceAfter = await token.allowance(owner.address, spender);
    expect(allowanceAfter).to.equal(allowanceBefore + amount);

    // Test de safeDecreaseAllowance
    const requestedDecrease = amount;
    await token.connect(owner).safeDecreaseAllowance(spender, requestedDecrease);
    const allowanceAfterDecrease = await token.allowance(owner.address, spender);
    expect(allowanceAfterDecrease).to.equal(allowanceAfter - requestedDecrease);

    // Test de forceApprove
    const newAllowance = 500;
    await token.connect(owner).forceApprove(spender, newAllowance);
    const allowanceAfterForceApprove = await token.allowance(owner.address, spender);
    expect(allowanceAfterForceApprove).to.equal(newAllowance);
  });

});
