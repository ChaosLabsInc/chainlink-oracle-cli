const { ethers } = require("hardhat");
const { utils } = require("ethers");

const {
    ETH_WHALE_ADDRESS
} = require("constants");

module.exports = {
    getBalanceForAddress: async function getBalanceForAddress(addy) {
        const bal = await ethers.provider.getBalance(addy);
        return ethers.utils.formatEther(bal);
    },
    genEthForAccount: async function genEthForAccount(to) {
        const signer = await ethers.provider.getSigner(ETH_WHALE_ADDRESS);
        await signer.sendTransaction({
            from: ETH_WHALE_ADDRESS,
            to: to,
            value: utils.parseEther("10"),
        });

    },
    impersonateAccount: async function impersonateAccount(impersonateMe) {
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [impersonateMe]
        });
    },
    stopImpersonateAccount: async function stopImpersonateAccount(stopImpersonateMe) {
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [stopImpersonateMe]
        });
    },
}