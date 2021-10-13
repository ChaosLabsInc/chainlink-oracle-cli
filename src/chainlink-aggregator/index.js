const { ethers } = require("hardhat");
const ABI = require("../abi");

module.exports = {
  genChainLinkAggregatorContract: async function genChainLinkAggregatorContract(chainlinkAggregatorAddress) {
    return new ethers.Contract(chainlinkAggregatorAddress, ABI.CHAINLINK_AGGREGATOR_ABI, ethers.provider);
  },
};
