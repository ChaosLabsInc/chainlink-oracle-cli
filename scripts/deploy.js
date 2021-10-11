const { ethers } = require("hardhat");
const ChaosUtils = require("../chaos-utils");
const Constants = require("../constants");
const AgentsHelper = require("../agents");
const ChainlinkProxyAggregator = require("../chainlink-aggregator");

/*
 * @contractName - the name of the mocker contract being deployed.
 * @lastRoundData - real data from the orignal contract of the last round.
 * @mocked - initial value for mocking, if a negative value is provided contract will default to original.
 * @step - the change in value (incremental/multiplier) every 'pace' blocks.
 * @pace - the number of blocks between each value change, counter starts from contract deployment.
 */
async function deployMockerContract(contractName, lastRoundData, mocked, step, pace) {
  const mockerContract = await ethers.getContractFactory(contractName);
  var constructor, deployer;
  fragments = mockerContract.interface.fragments;
  for (i = 0; i < fragments.length; i++) {
    if (fragments[i].type == "constructor") {
      constructor = fragments[i];
      break;
    }
  }
  if (constructor == undefined) {
    return null;
  }
  switch (constructor.inputs.length) {
    case 5:
      deployer = await mockerContract.deploy(
        lastRoundData.roundId,
        mocked < 0 ? lastRoundData.answer : mocked,
        lastRoundData.startedAt,
        lastRoundData.updatedAt,
        lastRoundData.answeredInRound
      );
      break;
    case 7:
      deployer = await mockerContract.deploy(
        lastRoundData.roundId,
        mocked < 0 ? lastRoundData.answer : mocked,
        lastRoundData.startedAt,
        lastRoundData.updatedAt,
        lastRoundData.answeredInRound,
        step,
        pace
      );
      break;
    default:
      throw "unsupported length";
  }
  await deployer.deployed();
  return deployer;
}

// provide "0x000000000000000000000000000000000000dEaD" address for orignal behaior, burn out address.
/*
 * @proxyAggregatorAddress - the address of the original proxy aggregator contract being mocked
 * @mockerAggregatorAddress - the address of the mocker contract, if a burn address is provided then
 * the default behavior remains ["0x000000000000000000000000000000000000dEaD"]
 */
async function deployManiupulatorContract(proxyAggregatorAddress, mockerAggregatorAddress) {
  const AggregatorManipulator = await ethers.getContractFactory("AggregatorManipulator");
  deployer = await AggregatorManipulator.deploy(proxyAggregatorAddress, mockerAggregatorAddress);
  await deployer.deployed();
  return deployer;
}

async function deployMockerContracts(data, step, pace) {
  const [aggregatorConstant, aggregatorConstantStep, AggregatordVolatileStep] = await Promise.all([
    deployMockerContract("AggregatorConstant", data, step, pace),
    deployMockerContract("AggregatorConstantStep", data, step, pace),
    deployMockerContract("AggregatordVolatileStep", data, step, pace),
  ]);
  ChaosUtils.logTable(
    ["aggregatorConstant", "aggregatorConstantStep", "AggregatordVolatileStep"],
    [aggregatorConstant.address, aggregatorConstantStep.address, AggregatordVolatileStep.address]
  );

  return {
    aggregatorConstant,
    aggregatorConstantStep,
    AggregatordVolatileStep,
  };
}

async function hijackAggregator(originAggregator, aggregatorManipulator) {
  const chainlinkAggregatorOwner = await originAggregator.owner();
  await AgentsHelper.sendEthFromTo(Constants.ETH_WHALE_ADDRESS, chainlinkAggregatorOwner);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [chainlinkAggregatorOwner],
  });
  const chainlinkAggOwnerSigner = await ethers.getSigner(chainlinkAggregatorOwner);
  try {
    await originAggregator.connect(chainlinkAggOwnerSigner).proposeAggregator(aggregatorManipulator.address);
  } catch (e) {
    throw new Error("Failed to propose new aggregator...", e);
  }
  try {
    await originAggregator.connect(chainlinkAggOwnerSigner).confirmAggregator(aggregatorManipulator.address);
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [chainlinkAggregatorOwner],
    });
  } catch (e) {
    throw new Error("Failed to confirm new aggregator...", e);
  }
}

async function fetchValue() {
  const PriceConsumerV3 = await ethers.getContractFactory("PriceConsumerV3");
  const priceConsumerV3 = await PriceConsumerV3.deploy();
  await priceConsumerV3.deployed();

  console.log("Fetching price...");
  ethPrice = await priceConsumerV3.getLatestPrice();
  console.log("Price data for ETH: ", ethPrice.toString());
}

async function demo() {
  let currentProxyAddress = Constants.CHAINLINK_ETH_USD_AGGREGATOR_ADDRESS;
  const originAggregator = await ChainlinkProxyAggregator.genChainLinkAggregatorContract(currentProxyAddress);
  const data = await originAggregator.latestRoundData();
  const { aggregatorConstant, aggregatorConstantStep, AggregatordVolatileStep } = await deployMockerContracts(
    data,
    0,
    1000,
    7
  );
  const aggregatorManipulator = await deployManiupulatorContract(currentProxyAddress, aggregatorConstantStep.address);
  ChaosUtils.logTable(
    ["aggregatorManipulator", "origin manipulator"],
    [aggregatorManipulator.address, currentProxyAddress]
  );
  await fetchValue();
  await hijackAggregator(originAggregator, aggregatorManipulator);
  await fetchValue();
}

module.exports = {
  deployMockerContracts: async function (data, step, pace) {
    await deployMockerContracts(data, step, pace);
  },
  deployManiupulatorContract: async function (proxyAggregatorAddress, mockerAggregatorAddress) {
    await deployManiupulatorContract(proxyAggregatorAddress, mockerAggregatorAddress);
  },
  deployManiupulatorContract: async function (originAggregator, aggregatorManipulator) {
    await hijackAggregator(originAggregator, aggregatorManipulator);
  },
  fetchValue: async function () {
    await fetchValue();
  },
  demo: async function () {
    await demo();
  },
};

// demo()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
