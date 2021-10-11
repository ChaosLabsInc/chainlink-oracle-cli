const { utils } = require("ethers");
const hre = require("hardhat");
const { ethers } = hre;

const { ETH_WHALE_ADDRESS } = require("constants");

module.exports = {
  getBalanceForAddress: async function getBalanceForAddress(addy) {
    const bal = await ethers.provider.getBalance(addy);
    return ethers.utils.formatEther(bal);
  },
  sendEthFromTo: async function sendEthFromTo(from, to) {
    try {
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [from],
      });
      const signer = await ethers.provider.getSigner(from);
      await signer.sendTransaction({
        from,
        to,
        value: utils.parseEther("10"),
      });
      await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [from],
      });
    } catch (e) {
      throw new Error("Failed to send Chainlink aggregator owner ETH...", e);
    }
  },
  impersonateAndGetSigner: async function impersonateAndGetSigner(impersonateMe) {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [impersonateMe],
    });
    const ownerSigner = await ethers.getSigner(impersonateMe);
    return ownerSigner;
  },
  stopImpersonateAccount: async function stopImpersonateAccount(stopImpersonateMe) {
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [stopImpersonateMe],
    });
  },
};
