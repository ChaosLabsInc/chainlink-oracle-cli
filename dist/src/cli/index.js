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
// import { ethers } from "hardhat";
const deploy_1 = __importDefault(require("../deploy/deploy"));
const figlet_1 = __importDefault(require("figlet"));
const clear_1 = __importDefault(require("clear"));
const inquirer_1 = __importDefault(require("inquirer"));
const chainlink_data_feeds_1 = __importDefault(require("../chainlink-data-feeds"));
const chalk_1 = __importDefault(require("chalk"));
// import ChainlinkProxyAggregator from "../chainlink-aggregator";
const QUESTION_PROMPT_NAMES = {
    HIJACKABLE_FEEDS: "Hijackable Price Feeds",
    MOCK_AGGREGATOR_SELECTION: "Mock Aggregator Selection",
    MOCK_AGGREGATOR_BASE_VALUE: "Mock Intial Value",
    MOCK_AGGREGATOR_VALUE_CHANGE: "Mock Value Change",
    MOCK_AGGREGATOR_CHANGE_PACE: "Mock Change Pace",
};
function contactName(name) {
    return "Aggregator" + name;
}
function targetKey(pairSelectionParsed) {
    return pairSelectionParsed.split(".")[0];
}
module.exports = {
    welcomeMessage: function () {
        return __awaiter(this, void 0, void 0, function* () {
            (0, clear_1.default)();
            console.log(chalk_1.default.green("🎉 ✨ 🔥 Hijacked Chainlink Oracles by: 🎉 ✨ 🔥"));
            console.log(chalk_1.default.blue(figlet_1.default.textSync("Chaos Labs")));
            yield this.selectTokenPairPricesToMock();
        });
    },
    selectTokenPairPricesToMock: function selectTokenPairPricesToMock() {
        return __awaiter(this, void 0, void 0, function* () {
            // ******************** GET PRICE FEED ********************
            const pricefeeds = yield chainlink_data_feeds_1.default.getEthereumProxiesForNetwork();
            const feedChoices = pricefeeds.map((pair, i) => `${i}. ${pair.pair}`);
            const subsetPFs = feedChoices.slice(0, 5);
            subsetPFs.push("6. View full list");
            let questions = [
                {
                    type: "rawlist",
                    name: QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS,
                    message: "Select price feeds:",
                    choices: subsetPFs,
                    default: [],
                },
            ];
            let pairSelection = yield inquirer_1.default.prompt(questions);
            let pairSelectionParsed = pairSelection[QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS];
            if (targetKey(pairSelectionParsed) == "6") {
                //more options:
                let questions = [
                    {
                        type: "rawlist",
                        name: QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS,
                        message: "Select price feeds:",
                        choices: feedChoices,
                    },
                ];
                pairSelection = yield inquirer_1.default.prompt(questions);
                pairSelectionParsed = pairSelection[QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS];
            }
            console.log(chalk_1.default.blue("You selected " + pairSelectionParsed));
            // ******************** GET MOCK FN ********************
            questions = [
                {
                    type: "list",
                    name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION,
                    message: "Select a function for the Mock Oracle",
                    choices: ["Constant", "Incremental", "Volatile", "Original"],
                    default: [],
                },
            ];
            const mockFnSelection = yield inquirer_1.default.prompt(questions);
            console.log(chalk_1.default.blue("You selected " + mockFnSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION]));
            // ******************** GET VALUES FOR MOCK ********************
            questions = [
                {
                    type: "number",
                    name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE,
                    message: "Select intial value of mock",
                    default: [0], //TODO - current value retrieved.
                },
            ];
            const valueSelection = yield inquirer_1.default.prompt(questions);
            console.log(chalk_1.default.blue("You selected " + valueSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE]));
            questions = [
                {
                    type: "number",
                    name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE,
                    message: "Select the change in price each tick",
                    default: [0],
                },
            ];
            const valueChangeSelection = yield inquirer_1.default.prompt(questions);
            console.log(chalk_1.default.blue("You selected " + valueChangeSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE]));
            questions = [
                {
                    type: "number",
                    name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE,
                    message: "Select the tick frequency - counted in blocks on chain",
                    default: [0],
                },
            ];
            const TickSelection = yield inquirer_1.default.prompt(questions);
            console.log(chalk_1.default.blue("You selected " + TickSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]));
            let originAddress = pricefeeds[targetKey(pairSelectionParsed)].proxy;
            let name = contactName(mockFnSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION]);
            console.log(chalk_1.default.blue(`Hijacking pair proxy ${pairSelectionParsed.substring(targetKey(pairSelectionParsed))} at address ${originAddress}`));
            yield deploy_1.default.fetchValue(originAddress);
            yield deploy_1.default.MockContract(name, originAddress, valueSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE], valueChangeSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE], TickSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]);
            yield deploy_1.default.fetchValue(originAddress);
            console.log(chalk_1.default.blue(`Let's get to work 💼 😏 ...`));
            console.log(chalk_1.default.yellow(figlet_1.default.textSync("Celebrate")));
            console.log(chalk_1.default.blue(`You are a shadowy super code 🔥 ✨ 😏 ...`));
        });
    },
};
//# sourceMappingURL=index.js.map