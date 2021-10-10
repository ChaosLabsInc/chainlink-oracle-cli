const { ethers } = require("hardhat");
const ABI = require("../abi");

module.exports = {
    genChainLinkAggregatorContract: async function genChainLinkAggregatorContract(
        chainlinkEthUsdAggregatorAddress
    ) {
        return new ethers.Contract(
            chainlinkEthUsdAggregatorAddress,
            ABI.CHAINLINK_AGGREGATOR_ABI,
            ethers.provider
        );
    },
    confirmAggregator: async function confirmAggregator(
        PROXY_AGG_CONTRACT_INSTANCE,
        signer,
        newAggregatorContractAddress
    ) {
        try {
            await
                PROXY_AGG_CONTRACT_INSTANCE
                    .connect(signer)
                    .proposeAggregator(newAggregatorContractAddress);
        } catch (e) {
            throw new Error("Failed to confirm new aggregator...", e);
        }
    },
    proposeAggregator: async function proposeAggregator(
        PROXY_AGG_CONTRACT_INSTANCE,
        signer,
        newAggregatorContractAddress
    ) {

    },
    proposeAndConfirmAggregator: async function proposeAndConfirmAggregator(
        PROXY_AGG_CONTRACT_INSTANCE,
        signer,
        newAggregatorContractAddress
    ) {
        await this.proposeAggregator(
            PROXY_AGG_CONTRACT_INSTANCE,
            signer,
            newAggregatorContractAddress
        );
        await this.confirmAggregator(
            PROXY_AGG_CONTRACT_INSTANCE,
            signer,
            newAggregatorContractAddress
        );
    }
}