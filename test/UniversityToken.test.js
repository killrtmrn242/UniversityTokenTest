const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniversityToken", function () {
  let UniversityToken;
  let universityToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    UniversityToken = await ethers.getContractFactory("UniversityToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    universityToken = await UniversityToken.deploy(2000); // Передаем initialSupply = 2000
    await universityToken.deployed();
  });

  describe("Deployment", function () {
    it("Должен назначить владельца", async function () {
      const contractOwner = await universityToken.owner();
      expect(contractOwner).to.equal(owner.address);
    });

    it("Должен инициализировать totalSupply значением initialSupply", async function () {
      const totalSupply = await universityToken.totalSupply();
      expect(totalSupply).to.equal(
        ethers.utils.parseEther("2000") // Используем ethers.utils.parseEther для 18 десятичных знаков
      );
    });

    it("Должен назначить initialSupply владельцу", async function () {
      const ownerBalance = await universityToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(
        ethers.utils.parseEther("2000") // Используем ethers.utils.parseEther для 18 десятичных знаков
      );
    });
  });

  describe("Transactions", function () {
    it("Должен переводить токены между аккаунтами", async function () {
      const amount = ethers.utils.parseEther("100"); // 100 токенов с 18 десятичными знаками
      await universityToken.transfer(addr1.address, amount);

      const addr1Balance = await universityToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(amount);
    });

    it("Должен выбрасывать ошибку при переводе больше, чем баланс", async function () {
      const initialOwnerBalance = await universityToken.balanceOf(owner.address);
      const amount = ethers.utils.parseEther("3000"); // Больше, чем баланс

      try {
        await universityToken.transfer(addr1.address, amount);
        expect.fail("Expected transfer to fail but did not revert");
      } catch (err) {
        expect(err.message).to.include("ERC20: transfer amount exceeds balance");
      }

      const ownerBalanceAfter = await universityToken.balanceOf(owner.address);
      expect(ownerBalanceAfter).to.equal(initialOwnerBalance);
    });
  });

  describe("Custom Functions", function () {
    it("Должен возвращать отправителя транзакции", async function () {
      const sender = await universityToken.getTransactionSender(owner.address);
      expect(sender).to.equal(owner.address);
    });

    it("Должен выбрасывать ошибку, если у аккаунта нет токенов", async function () {
      try {
        await universityToken.getTransactionSender(addr1.address);
        expect.fail("Expected getTransactionSender to fail but did not revert");
      } catch (err) {
        expect(err.message).to.include("No tokens held by this account");
      }
    });

    it("Должен выбрасывать ошибку, если транзакций не было", async function () {
      try {
        await universityToken.getLastTransactionTimestamp(addr2.address);
        expect.fail("Expected getLastTransactionTimestamp to fail but did not revert");
      } catch (err) {
        expect(err.message).to.include("No transactions found");
      }
    });
  });
});