// import { ethers } from "hardhat";
import delpoyer from "../deploy/deploy";
import figlet from "figlet";
import clear from "clear";
import inquirer from "inquirer";
import PriceFeeds from "../chainlink-data-feeds";
import chalk from "chalk";
// import ChainlinkProxyAggregator from "../chainlink-aggregator";

const QUESTION_PROMPT_NAMES = {
  HIJACKABLE_FEEDS: "Hijackable Price Feeds",
  MOCK_AGGREGATOR_SELECTION: "Mock Aggregator Selection",
  MOCK_AGGREGATOR_BASE_VALUE: "Mock Intial Value",
  MOCK_AGGREGATOR_VALUE_CHANGE: "Mock Value Change",
  MOCK_AGGREGATOR_CHANGE_PACE: "Mock Change Pace",
};

function contactName(name: string) {
  return "Aggregator" + name;
}

function targetKey(pairSelectionParsed: string) {
  return pairSelectionParsed.split(".")[0];
}

module.exports = {
  welcomeMessage: async function () {
    clear();
    console.log(chalk.green("🎉 ✨ 🔥 Hijacked Chainlink Oracles by: 🎉 ✨ 🔥"));
    console.log(chalk.blue(figlet.textSync("Chaos Labs")));
    await this.selectTokenPairPricesToMock();
  },
  selectTokenPairPricesToMock: async function selectTokenPairPricesToMock() {
    // ******************** GET PRICE FEED ********************
    const pricefeeds = await PriceFeeds.getEthereumProxiesForNetwork();
    const feedChoices = pricefeeds.map((pair: any, i: number) => `${i}. ${pair.pair}`);
    const subsetPFs = feedChoices.slice(0, 5);
    subsetPFs.push("6. View full list");
    let questions: {
      type: string;
      name: string;
      message: string;
      choices?: string[];
      default?: number[];
    }[] = [
      {
        type: "rawlist",
        name: QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS,
        message: "Select price feeds:",
        choices: subsetPFs,
        default: [],
      },
    ];
    let pairSelection = await inquirer.prompt(questions);
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
      pairSelection = await inquirer.prompt(questions);
      pairSelectionParsed = pairSelection[QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS];
    }
    console.log(chalk.blue("You selected " + pairSelectionParsed));

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
    const mockFnSelection = await inquirer.prompt(questions);
    console.log(chalk.blue("You selected " + mockFnSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION]));
    // ******************** GET VALUES FOR MOCK ********************
    questions = [
      {
        type: "number",
        name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE,
        message: "Select intial value of mock",
        default: [0], //TODO - current value retrieved.
      },
    ];
    const valueSelection = await inquirer.prompt(questions);
    console.log(chalk.blue("You selected " + valueSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE]));
    questions = [
      {
        type: "number",
        name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE,
        message: "Select the change in price each tick",
        default: [0],
      },
    ];
    const valueChangeSelection = await inquirer.prompt(questions);
    console.log(chalk.blue("You selected " + valueChangeSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE]));
    questions = [
      {
        type: "number",
        name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE,
        message: "Select the tick frequency - counted in blocks on chain",
        default: [0],
      },
    ];
    const TickSelection = await inquirer.prompt(questions);
    console.log(chalk.blue("You selected " + TickSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]));

    let originAddress = pricefeeds[targetKey(pairSelectionParsed)].proxy;
    let name = contactName(mockFnSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION]);
    console.log(
      chalk.blue(
        `Hijacking pair proxy ${pairSelectionParsed.substring(
          targetKey(pairSelectionParsed)
        )} at address ${originAddress}`
      )
    );
    await delpoyer.fetchValue(originAddress);
    await delpoyer.MockContract(
      name,
      originAddress,
      valueSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE],
      valueChangeSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE],
      TickSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]
    );
    await delpoyer.fetchValue(originAddress);

    console.log(chalk.blue(`Let's get to work 💼 😏 ...`));
    console.log(chalk.yellow(figlet.textSync("Celebrate")));
    console.log(chalk.blue(`You are a shadowy super code 🔥 ✨ 😏 ...`));
  },
};
