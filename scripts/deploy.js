const { ethers } = require("hardhat");
const ChaosUtils = require("../chaos-utils");
const Constants = require("../constants");
const AgentsHelper = require("../agents");
const ChainlinkAggregator = require("../chainlink-aggregator");

async function deployContracts() {
    const [PriceConsumerV3, ChaosAggregator] = await Promise.all([
        ethers.getContractFactory("PriceConsumerV3"),
        ethers.getContractFactory("ChaosAggregator"),
    ]);

    const [priceConsumerV3, chaosAggregator] = await Promise.all([
        PriceConsumerV3.deploy(),
        ChaosAggregator.deploy(),
    ]);

    await Promise.all([
            priceConsumerV3.deployed(),
            chaosAggregator.deployed(),
    ]);

    return {
        priceConsumerV3,
        chaosAggregator
    };
}

async function main() {
    // Deploy Contracts
    const { priceConsumerV3, chaosAggregator } = await deployContracts();
    ChaosUtils.logTable(["PriceConsumerV3", "ChaosAggV0"], [priceConsumerV3.address, chaosAggregator.address]);

    // Get ChainlinkAggregator Contract
    const PROXY_AGG_CONTRACT_INSTANCE = await ChainlinkAggregator
        .genChainLinkAggregatorContract(Constants.CHAINLINK_ETH_USD_AGGREGATOR_ADDRESS);
    const chainlinkAggregatorOwner = await PROXY_AGG_CONTRACT_INSTANCE.owner();
    await AgentsHelper.sendEthFromTo(Constants.ETH_WHALE_ADDRESS, chainlinkAggregatorOwner);
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [chainlinkAggregatorOwner]
    });
    const chainlinkAggOwnerSigner = await ethers.getSigner(chainlinkAggregatorOwner)

    try {
        await
            PROXY_AGG_CONTRACT_INSTANCE
                .connect(chainlinkAggOwnerSigner)
                .proposeAggregator(chaosAggregator.address);
    } catch (e) {
        throw new Error("Failed to propose new aggregator...", e);
    }

    try {
        await
            PROXY_AGG_CONTRACT_INSTANCE
                .connect(chainlinkAggOwnerSigner)
                .confirmAggregator(chaosAggregator.address);
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [chainlinkAggregatorOwner]
        });
    } catch (e) {
        throw new Error("Failed to confirm new aggregator...", e);
    }

    console.log("Fetching price...");
    ethPrice = await priceConsumerV3.getLatestPrice()
    console.log("Price data for ETH: ", ethPrice.toString())
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
