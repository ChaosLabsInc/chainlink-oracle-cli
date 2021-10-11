const { ethers } = require("hardhat");
const deployer = require("./deploy");
const ChaosUtils = require("../chaos-utils");
const Constants = require("../constants");
const AgentsHelper = require("../agents");
const ChainlinkProxyAggregator = require("../chainlink-aggregator");

async function MockConstantValue(currentProxyAddress, value) {
  const originAggregator = await ChainlinkProxyAggregator.genChainLinkAggregatorContract(currentProxyAddress);
  const data = await originAggregator.latestRoundData();
  const { aggregatorConstant, aggregatorConstantStep, AggregatordVolatileStep } = await deployer.deployMockerContracts(
    data,
    value,
    0,
    0
  );
  const aggregatorManipulator = await deployer.deployManiupulatorContract(
    currentProxyAddress,
    aggregatorConstant.address
  );
  ChaosUtils.logTable(
    ["aggregatorManipulator", "origin manipulator"],
    [aggregatorManipulator.address, currentProxyAddress]
  );
  await hijackAggregator(originAggregator, aggregatorManipulator);
}

async function MockChangingValue(currentProxyAddress, value, change, pace) {
  const originAggregator = await ChainlinkProxyAggregator.genChainLinkAggregatorContract(currentProxyAddress);
  const data = await originAggregator.latestRoundData();
  const { aggregatorConstant, aggregatorConstantStep, AggregatordVolatileStep } = await deployer.deployMockerContracts(
    data,
    value,
    change,
    pace
  );
  const aggregatorManipulator = await deployer.deployManiupulatorContract(
    currentProxyAddress,
    aggregatorConstantStep.address
  );
  ChaosUtils.logTable(
    ["aggregatorManipulator", "origin manipulator"],
    [aggregatorManipulator.address, currentProxyAddress]
  );
  await hijackAggregator(originAggregator, aggregatorManipulator);
}

async function MockVolatileValue(currentProxyAddress, value, change, pace) {
  const originAggregator = await ChainlinkProxyAggregator.genChainLinkAggregatorContract(currentProxyAddress);
  const data = await originAggregator.latestRoundData();
  const { aggregatorConstant, aggregatorConstantStep, AggregatordVolatileStep } = await deployer.deployMockerContracts(
    data,
    value,
    change,
    pace
  );
  const aggregatorManipulator = await deployer.deployManiupulatorContract(
    currentProxyAddress,
    AggregatordVolatileStep.address
  );
  ChaosUtils.logTable(
    ["aggregatorManipulator", "origin manipulator"],
    [aggregatorManipulator.address, currentProxyAddress]
  );
  await hijackAggregator(originAggregator, aggregatorManipulator);
}

module.exports = {
  MockVolatileValue: async function (currentProxyAddress, value, change, pace) {
    await MockVolatileValue(currentProxyAddress, value, change, pace);
  },
  MockChangingValue: async function (currentProxyAddress, value, change, pace) {
    await MockChangingValue(currentProxyAddress, value, change, pace);
  },
  MockConstantValue: async function (currentProxyAddress, value) {
    await MockConstantValue(currentProxyAddress, value);
  },
};
