const { ethers } = require("hardhat");
const ChaosUtils = require("../chaos-utils");
const Constants = require("../constants");
const AgentsHelper = require("../agents");
const ChainlinkProxyAggregator = require("../chainlink-aggregator");

async function deployContracts(proxyAggregatorAddress) {
  const originAggregator = await ChainlinkProxyAggregator.genChainLinkAggregatorContract(proxyAggregatorAddress);
  const data = await originAggregator.latestRoundData();
  console.log(data.roundId, data.answer, data.startedAt, data.updatedAt, data.answeredInRound); //TODO debug
  const [AggregatorConstant, AggregatorConstantStep, AggregatorMultipliedStep, AggregatorManipulator] =
    await Promise.all([
      ethers.getContractFactory("AggregatorConstant"),
      ethers.getContractFactory("AggregatorConstantStep"),
      ethers.getContractFactory("AggregatorMultipliedStep"),
      ethers.getContractFactory("AggregatorManipulator"),
    ]);

  const [aggregatorConstant, aggregatorConstantStep, aggregatorMultipliedStep, aggregatorManipulator] =
    await Promise.all([
      AggregatorConstant.deploy(data.roundId, data.answer, data.startedAt, data.updatedAt, data.answeredInRound),
      AggregatorConstantStep.deploy(
        data.roundId,
        data.answer,
        data.startedAt,
        data.updatedAt,
        data.answeredInRound,
        0,
        0
      ),
      AggregatorMultipliedStep.deploy(
        data.roundId,
        data.answer,
        data.startedAt,
        data.updatedAt,
        data.answeredInRound,
        0,
        0
      ),
      AggregatorManipulator.deploy(proxyAggregatorAddress, 0),
    ]);
  await Promise.all([
    aggregatorConstant.deployed(),
    aggregatorConstantStep.deployed(),
    aggregatorMultipliedStep.deployed(),
    aggregatorManipulator.deployed(),
  ]);
  ChaosUtils.logTable(
    ["aggregatorConstant", "aggregatorConstantStep", "aggregatorMultipliedStep", "aggregatorManipulator"],
    [
      aggregatorConstant.address,
      aggregatorConstantStep.address,
      aggregatorMultipliedStep.address,
      aggregatorManipulator.address,
    ]
  );

  return {
    aggregatorConstant,
    aggregatorConstantStep,
    aggregatorMultipliedStep,
    aggregatorManipulator,
  };
}

async function main() {
  const { aggregatorConstant, aggregatorConstantStep, aggregatorMultipliedStep, aggregatorManipulator } =
    await deployContracts(Constants.CHAINLINK_ETH_USD_AGGREGATOR_ADDRESS);

  const chainlinkAggregatorOwner = await PROXY_AGG_CONTRACT_INSTANCE.owner();
  await AgentsHelper.sendEthFromTo(Constants.ETH_WHALE_ADDRESS, chainlinkAggregatorOwner);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [chainlinkAggregatorOwner],
  });
  const chainlinkAggOwnerSigner = await ethers.getSigner(chainlinkAggregatorOwner);

  try {
    await PROXY_AGG_CONTRACT_INSTANCE.connect(chainlinkAggOwnerSigner).proposeAggregator(chaosAggregator.address);
  } catch (e) {
    throw new Error("Failed to propose new aggregator...", e);
  }

  try {
    await PROXY_AGG_CONTRACT_INSTANCE.connect(chainlinkAggOwnerSigner).confirmAggregator(chaosAggregator.address);
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [chainlinkAggregatorOwner],
    });
  } catch (e) {
    throw new Error("Failed to confirm new aggregator...", e);
  }

  console.log("Fetching price...");
  ethPrice = await priceConsumerV3.getLatestPrice();
  console.log("Price data for ETH: ", ethPrice.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
