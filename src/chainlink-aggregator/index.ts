import { ethers } from "hardhat";
import ABI from "../abi/abi";

export = {
  genChainLinkAggregatorContract: async function genChainLinkAggregatorContract(chainlinkAggregatorAddress: string) {
    return new ethers.Contract(chainlinkAggregatorAddress, ABI.CHAINLINK_AGGREGATOR_ABI, ethers.provider);
  },
};
