import { utils } from "ethers";
import { ethers } from "hardhat";
import hre from "hardhat";

const { ETH_WHALE_ADDRESS } = require("constants");

export = {
  getBalanceForAddress: async function getBalanceForAddress(address: string) {
    const bal = await ethers.provider.getBalance(address);
    return ethers.utils.formatEther(bal);
  },
  sendEthFromTo: async function sendEthFromTo(from: string, to: string) {
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
      throw new Error(`Failed to send Chainlink aggregator owner ETH...[${e}]`);
    }
  },
  impersonateAndGetSigner: async function impersonateAndGetSigner(impersonateMe: string) {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [impersonateMe],
    });
    const ownerSigner = await ethers.getSigner(impersonateMe);
    return ownerSigner;
  },
  stopImpersonateAccount: async function stopImpersonateAccount(stopImpersonateMe: string) {
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [stopImpersonateMe],
    });
  },
};
