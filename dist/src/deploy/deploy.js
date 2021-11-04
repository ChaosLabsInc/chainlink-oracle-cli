"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const hardhat_1 = require("hardhat");
const hardhat_2 = __importDefault(require("hardhat"));
const utils_1 = __importDefault(require("../utils"));
const Constants_1 = __importDefault(require("../Constants"));
const agents_1 = __importDefault(require("../agents"));
const chalk_1 = __importDefault(require("chalk"));
const chainlink_aggregator_1 = __importDefault(require("../chainlink-aggregator"));
/*
 * @contractName - the name of the mocker contract being deployed.
 * @lastRoundData - real data from the orignal contract of the last round.
 * @mocked - initial value for mocking, if a negative value is provided contract will default to original.
 * @step - the change in value (incremental/multiplier) every 'pace' blocks.
 * @pace - the number of blocks between each value change, counter starts from contract deployment.
 */
function deployMockerContract(contractName, lastRoundData, mocked, step, pace) {
    return __awaiter(this, void 0, void 0, function* () {
        const mockerContract = yield hardhat_1.ethers.getContractFactory(contractName);
        var constructor, deployer;
        let fragments = mockerContract.interface.fragments;
        for (let i = 0; i < fragments.length; i++) {
            if (fragments[i].type == "constructor") {
                constructor = fragments[i];
                break;
            }
        }
        if (constructor == undefined) {
            throw "constructor not found";
        }
        switch (constructor.inputs.length) {
            case 5:
                deployer = yield mockerContract.deploy(lastRoundData.roundId, mocked < 0 ? lastRoundData.answer : mocked, lastRoundData.startedAt, lastRoundData.updatedAt, lastRoundData.answeredInRound);
                break;
            case 7:
                deployer = yield mockerContract.deploy(lastRoundData.roundId, mocked < 0 ? lastRoundData.answer : mocked, lastRoundData.startedAt, lastRoundData.updatedAt, lastRoundData.answeredInRound, step, pace);
                break;
            default:
                throw "unsupported length";
        }
        yield deployer.deployed();
        return deployer;
    });
}
// provide "0x000000000000000000000000000000000000dEaD" address for orignal behaior, burn out address.
/*
 * @proxyAggregatorAddress - the address of the original proxy aggregator contract being mocked
 * @mockerAggregatorAddress - the address of the mocker contract, if a burn address is provided then
 * the default behavior remains ["0x000000000000000000000000000000000000dEaD"]
 */
function deployManiupulatorContract(proxyAggregatorAddress, mockerAggregatorAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const AggregatorManipulator = yield hardhat_1.ethers.getContractFactory("AggregatorManipulator");
        let deployer = yield AggregatorManipulator.deploy(proxyAggregatorAddress, mockerAggregatorAddress);
        yield deployer.deployed();
        return deployer;
    });
}
function deployAllMockerContracts(data, value, step, pace) {
    return __awaiter(this, void 0, void 0, function* () {
        const [aggregatorConstant, aggregatorIncremental, AggregatorVolatile] = yield Promise.all([
            deployMockerContract("AggregatorConstant", data, value, step, pace),
            deployMockerContract("AggregatorIncremental", data, value, step, pace),
            deployMockerContract("AggregatorVolatile", data, value, step, pace),
        ]);
        utils_1.default.logTable(["aggregatorConstant", "aggregatorIncremental", "AggregatorVolatile"], [aggregatorConstant.address, aggregatorIncremental.address, AggregatorVolatile.address]);
        return {
            aggregatorConstant,
            aggregatorIncremental,
            AggregatorVolatile,
        };
    });
}
function mockAggregator(originAggregator, aggregatorManipulator) {
    return __awaiter(this, void 0, void 0, function* () {
        const chainlinkAggregatorOwner = yield originAggregator.owner();
        yield agents_1.default.sendEthFromTo(Constants_1.default.ETH_WHALE_ADDRESS, chainlinkAggregatorOwner);
        yield hardhat_2.default.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [chainlinkAggregatorOwner],
        });
        const chainlinkAggOwnerSigner = yield hardhat_1.ethers.getSigner(chainlinkAggregatorOwner);
        try {
            yield originAggregator.connect(chainlinkAggOwnerSigner).proposeAggregator(aggregatorManipulator.address);
        }
        catch (e) {
            throw new Error(`Failed to propose new aggregator...[${e}]`);
        }
        try {
            yield originAggregator.connect(chainlinkAggOwnerSigner).confirmAggregator(aggregatorManipulator.address);
            yield hardhat_2.default.network.provider.request({
                method: "hardhat_stopImpersonatingAccount",
                params: [chainlinkAggregatorOwner],
            });
        }
        catch (e) {
            throw new Error(`Failed to confirm new aggregator...[${e}]`);
        }
    });
}
function fetchValue(aggergatorAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const PriceConsumerV3 = yield hardhat_1.ethers.getContractFactory("PriceConsumerV3");
        const priceConsumerV3 = yield PriceConsumerV3.deploy(aggergatorAddress);
        let res = yield priceConsumerV3.deployed();
        console.log("Fetching price...");
        let price = yield priceConsumerV3.getLatestPrice();
        console.log(chalk_1.default.blue("Price: ", price.toString()));
        return price;
    });
}
function demo() {
    return __awaiter(this, void 0, void 0, function* () {
        let currentProxyAddress = Constants_1.default.CHAINLINK_ETH_USD_AGGREGATOR_ADDRESS;
        const originAggregator = yield chainlink_aggregator_1.default.genChainLinkAggregatorContract(currentProxyAddress);
        const data = yield originAggregator.latestRoundData();
        const { aggregatorIncremental } = yield deployAllMockerContracts(data, 0, 1000, 7);
        const aggregatorManipulator = yield deployManiupulatorContract(currentProxyAddress, aggregatorIncremental.address);
        utils_1.default.logTable(["aggregatorManipulator", "origin manipulator"], [aggregatorManipulator.address, currentProxyAddress]);
        yield fetchValue("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419");
        yield mockAggregator(originAggregator, aggregatorManipulator);
        yield fetchValue("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419");
    });
}
function MockContract(contractName, currentProxyAddress, value, change, pace) {
    return __awaiter(this, void 0, void 0, function* () {
        const originAggregator = yield chainlink_aggregator_1.default.genChainLinkAggregatorContract(currentProxyAddress);
        const data = yield originAggregator.latestRoundData();
        const mockerContract = yield deployMockerContract(contractName, data, value, change, pace);
        const aggregatorManipulator = yield deployManiupulatorContract(currentProxyAddress, mockerContract.address);
        utils_1.default.logTable(["Aggregator Manipulator", "Mocker Aggregator", "Origin Aggregator"], [aggregatorManipulator.address, mockerContract.address, currentProxyAddress]);
        yield mockAggregator(originAggregator, aggregatorManipulator);
    });
}
module.exports = {
    MockContract: function (contractName, currentProxyAddress, value, change, pace) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MockContract(contractName, currentProxyAddress, value, change, pace);
        });
    },
    deployAllMockerContracts: function (data, mocked, step, pace) {
        return __awaiter(this, void 0, void 0, function* () {
            yield deployAllMockerContracts(data, mocked, step, pace);
        });
    },
    deployMockerContract: function (contractName, data, mocked, step, pace) {
        return __awaiter(this, void 0, void 0, function* () {
            yield deployMockerContract(contractName, data, mocked, step, pace);
        });
    },
    deployManiupulatorContract: function (proxyAggregatorAddress, mockerAggregatorAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield deployManiupulatorContract(proxyAggregatorAddress, mockerAggregatorAddress);
        });
    },
    fetchValue: function (aggergatorAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetchValue(aggergatorAddress);
        });
    },
    demo: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield demo();
        });
    },
};
//# sourceMappingURL=deploy.js.map