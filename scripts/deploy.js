const { ethers } = require("hardhat");

const Constants = require("../constants");
const AgentsHelper = require("../agents");
const ChainlinkAggregator = require("../chainlink-aggregator");

async function impersonateProposeConfirmAggregator(
    newAggregatorContractAddress,
) {
    const PROXY_AGG_CONTRACT_INSTANCE =
        await ChainlinkAggregator.genChainLinkAggregatorContract(Constants.CHAINLINK_ETH_USD_AGGREGATOR_ADDRESS);
        
    const aggregatorOwnerAddress = await PROXY_AGG_CONTRACT_INSTANCE.owner()
    await AgentsHelper.genEthForAccount(aggregatorOwnerAddress);

    await AgentsHelper.impersonateAccount(aggregatorOwnerAddress);
    const aggregatorOwnerSigner = await ethers.provider.getSigner(aggregatorOwnerAddress);
    await
        ChainlinkAggregator.proposeAndConfirmAggregator(
            PROXY_AGG_CONTRACT_INSTANCE,
            aggregatorOwnerSigner,
            newAggregatorContractAddress
        );

    await AgentsHelper.stopImpersonateAccount(aggregatorOwnerAddress);
}

async function main() {
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

    await impersonateProposeConfirmAggregator(chaosAggregator.address);

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
