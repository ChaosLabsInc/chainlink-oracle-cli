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
const deploy_1 = __importDefault(require("../deploy/deploy"));
const figlet_1 = __importDefault(require("figlet"));
const clear_1 = __importDefault(require("clear"));
const inquirer_1 = __importDefault(require("inquirer"));
const chainlink_data_feeds_1 = __importDefault(require("../chainlink-data-feeds"));
const questions_1 = __importDefault(require("../questions"));
const utils_1 = __importDefault(require("../utils"));
function contactName(name) {
    return "Aggregator" + name;
}
const YOU_SELECTED = "You selected ";
const { targetKey, logBlue, logGreen, logYellow } = utils_1.default;
const { QUESTION_NAMES } = questions_1.default;
const { prompt } = inquirer_1.default;
module.exports = {
    welcomeMessage: function () {
        return __awaiter(this, void 0, void 0, function* () {
            (0, clear_1.default)();
            logGreen("🎉 ✨ 🔥 Mocked Chainlink Oracles by: 🎉 ✨ 🔥");
            logBlue(figlet_1.default.textSync("Chaos Labs"));
        });
    },
    getEthereumProxiesForNetwork: function getEthereumProxiesForNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            const priceFeeds = yield chainlink_data_feeds_1.default.getEthereumProxiesForNetwork();
            const tokenPairsSliced = priceFeeds.map((pair) => `${pair.pair}`);
            const inquirerChoices = [
                ...tokenPairsSliced.slice(0, 4),
                QUESTION_NAMES.VIEW_FULL_LIST,
                QUESTION_NAMES.SEARCH_TOKEN_PAIR,
            ];
            return {
                priceFeeds,
                inquirerChoices,
            };
        });
    },
    selectTokenPairPricesToMock: function selectTokenPairPricesToMock() {
        return __awaiter(this, void 0, void 0, function* () {
            const { priceFeeds, inquirerChoices } = yield this.getEthereumProxiesForNetwork();
            let pairSelection = yield prompt(questions_1.default.getConfigurablePriceFeedsQuestion(inquirerChoices));
            let pairSelectionParsed = pairSelection[QUESTION_NAMES.CONFIGURABLE_FEEDS];
            if (QUESTION_NAMES.VIEW_FULL_LIST === pairSelectionParsed) {
                pairSelection = yield prompt(questions_1.default.getAllPriceFeedsQuestion(priceFeeds.map((pf) => pf.pair)));
                pairSelectionParsed = pairSelection[QUESTION_NAMES.CONFIGURABLE_FEEDS];
                return { pairSelectionParsed, priceFeeds };
            }
            else if (QUESTION_NAMES.SEARCH_TOKEN_PAIR === pairSelectionParsed) {
                let searchedTickerSelection = yield prompt(questions_1.default.getTokenPairSearchValue());
                let parsedQuery = searchedTickerSelection[QUESTION_NAMES.SEARCH_TOKEN_PAIR];
                const filteredFeeds = priceFeeds.filter((pf) => {
                    return pf.pair.toLowerCase().includes(parsedQuery.toLowerCase());
                });
                return this.selectTokenPairFiltered(filteredFeeds);
            }
            logBlue(YOU_SELECTED + pairSelectionParsed);
            return { pairSelectionParsed, priceFeeds };
        });
    },
    selectAllTokenPairs: function selectAllTokenPairs(providedFeeds) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedArr = providedFeeds.map((pf) => pf.pair);
            let pairSelection = yield prompt(questions_1.default.getConfigurablePriceFeedsQuestion(parsedArr));
            let pairSelectionParsed = pairSelection[QUESTION_NAMES.CONFIGURABLE_FEEDS];
            return {
                pairSelectionParsed,
                priceFeeds: providedFeeds,
            };
        });
    },
    selectTokenPairFiltered: function selectTokenPairFiltered(providedFeeds) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedArr = providedFeeds.map((pf) => pf.pair);
            let pairSelection = yield prompt(questions_1.default.getConfigurablePriceFeedsQuestion(parsedArr));
            let pairSelectionParsed = pairSelection[QUESTION_NAMES.CONFIGURABLE_FEEDS];
            return {
                pairSelectionParsed,
                priceFeeds: providedFeeds,
            };
        });
    },
    selectMockFunction: function selectMockFunction() {
        return __awaiter(this, void 0, void 0, function* () {
            const mockFnSelection = yield prompt(questions_1.default.getMockFunctionQuestion());
            logBlue(YOU_SELECTED + mockFnSelection[QUESTION_NAMES.MOCK_AGGREGATOR_SELECTION]);
            return mockFnSelection[QUESTION_NAMES.MOCK_AGGREGATOR_SELECTION];
        });
    },
    selectInitialValue: function selectInitialValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const initValue = yield prompt(questions_1.default.getSelectInitialValueQuestion());
            logBlue(YOU_SELECTED + initValue[QUESTION_NAMES.MOCK_AGGREGATOR_BASE_VALUE]);
            return initValue;
        });
    },
    selectPriceChange: function selectPriceChange() {
        return __awaiter(this, void 0, void 0, function* () {
            const valueChangeSelection = yield prompt(questions_1.default.getPriceChangeQuestion());
            logBlue(YOU_SELECTED + valueChangeSelection[QUESTION_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE]);
            return valueChangeSelection;
        });
    },
    selectBlockUpdateIntervalSize: function selectBlockUpdateIntervalSize() {
        return __awaiter(this, void 0, void 0, function* () {
            const blockUpdate = yield prompt(questions_1.default.getPriceChangeFrequency());
            logBlue(YOU_SELECTED + blockUpdate[QUESTION_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]);
            return blockUpdate;
        });
    },
    deploy: function deploy(pairSelectionParsed, priceFeeds, mockFunction, initValue, valueChangeSelection, tickSelection) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedPriceFeed = priceFeeds.find((pf) => pf.pair === pairSelectionParsed);
            if (selectedPriceFeed === undefined) {
                throw new Error("Could not find price feed...");
            }
            const { proxy } = selectedPriceFeed;
            let name = contactName(mockFunction);
            logGreen(`Configuring pair proxy ${pairSelectionParsed.substring(Number(targetKey(pairSelectionParsed)))} at address ${proxy}`);
            yield deploy_1.default.fetchValue(proxy);
            console.log(name, proxy, initValue[QUESTION_NAMES.MOCK_AGGREGATOR_BASE_VALUE], valueChangeSelection[QUESTION_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE], tickSelection[QUESTION_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]);
            yield deploy_1.default.MockContract(name, proxy, 
            // @ts-ignore
            initValue[QUESTION_NAMES.MOCK_AGGREGATOR_BASE_VALUE], 
            // @ts-ignore
            valueChangeSelection[QUESTION_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE], 
            // @ts-ignore
            tickSelection[QUESTION_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]);
            yield deploy_1.default.fetchValue(proxy);
            logBlue(`Let's get to work 💼 😏 ...`);
            logYellow(figlet_1.default.textSync("Celebrate"));
            logBlue(`You are a shadowy super code 🔥 ✨ 😏 ...`);
        });
    },
};
//# sourceMappingURL=index.js.map