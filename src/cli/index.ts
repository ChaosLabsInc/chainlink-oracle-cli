import deployer from "../deploy/deploy";
import figlet from "figlet";
import clear from "clear";
import inquirer from "inquirer";
import PriceFeeds from "../chainlink-data-feeds";
import {
  QUESTION_PROMPT_NAMES,
  getConfigurablePriceFeedsQuestion,
  getAllPriceFeedsQuestion,
  getSelectInitialValueQuestion,
  getMockFunctionQuestion,
  getPriceChangeQuestion,
  getPriceChangeFrequency,
  showAllPriceFeedsSelected,
  showSearchPriceFeedsSelected,
} from "./questions";
import { targetKey } from "./utils";
import chalk from "chalk";

type PriceFeed = {
  pair: string; // '1INCH / ETH'
  proxy: string; // 0xwgmi
};

function contactName(name: string) {
  return "Aggregator" + name;
}

const YOU_SELECTED = "You selected ";

export = {
  welcomeMessage: async function () {
    clear();
    console.log(chalk.green("🎉 ✨ 🔥 Configured Chainlink Oracles by: 🎉 ✨ 🔥"));
    console.log(chalk.blue(figlet.textSync("Chaos Labs")));
  },
  selectTokenPairPricesToMock: async function selectTokenPairPricesToMock() {
    const priceFeeds = await PriceFeeds.getEthereumProxiesForNetwork();
    const tokenPairsSliced = priceFeeds.map((pair: any, i: number) => `${pair.pair}`);
    const getPriceFeedChoices = [...tokenPairsSliced.slice(0, 4), "View full list", "Search by ticker"];
    let pairSelection = await inquirer.prompt(getConfigurablePriceFeedsQuestion(getPriceFeedChoices));
    let pairSelectionParsed = pairSelection[QUESTION_PROMPT_NAMES.CONFIGURABLE_FEEDS];
    if (showAllPriceFeedsSelected(pairSelectionParsed)) {
      pairSelection = await inquirer.prompt<number>(getAllPriceFeedsQuestion(tokenPairsSliced));
      pairSelectionParsed = pairSelection[QUESTION_PROMPT_NAMES.CONFIGURABLE_FEEDS];
    } else if (showSearchPriceFeedsSelected(pairSelectionParsed)) {
      // TODO:
    }
    console.log(chalk.blue(YOU_SELECTED + pairSelectionParsed));
    return { pairSelectionParsed, priceFeeds };
  },
  selectMockFunction: async function selectMockFunction(): Promise<any> {
    const mockFnSelection = await inquirer.prompt(getMockFunctionQuestion());
    console.log(chalk.blue(YOU_SELECTED + mockFnSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION]));
    return mockFnSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION];
  },
  selectInitialValue: async function selectInitialValue(): Promise<any> {
    const initValue = await inquirer.prompt(getSelectInitialValueQuestion());
    console.log(chalk.blue(YOU_SELECTED + initValue[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE]));
    return initValue;
  },
  selectPriceChange: async function selectPriceChange(): Promise<any> {
    const valueChangeSelection = await inquirer.prompt(getPriceChangeQuestion());
    console.log(chalk.blue(YOU_SELECTED + valueChangeSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE]));
    return valueChangeSelection;
  },
  selectBlockUpdateIntervalSize: async function selectBlockUpdateIntervalSize(): Promise<any> {
    const blockUpdate = await inquirer.prompt(getPriceChangeFrequency());
    console.log(chalk.blue(YOU_SELECTED + blockUpdate[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]));
    return blockUpdate;
  },
  deploy: async function deploy(
    pairSelectionParsed: string,
    priceFeeds: Array<PriceFeed>,
    mockFunction: any,
    initValue: any,
    valueChangeSelection: any,
    tickSelection: any
  ): Promise<void> {
    const selectedPriceFeed = priceFeeds.find((pf: PriceFeed) => pf.pair === pairSelectionParsed);
    if (selectedPriceFeed === undefined) {
      throw new Error("Could not find price feed...");
    }
    const { proxy } = selectedPriceFeed;
    let name = contactName(mockFunction);
    console.log(
      chalk.green(
        `Configuring pair proxy ${pairSelectionParsed.substring(
          Number(targetKey(pairSelectionParsed))
        )} at address ${proxy}`
      )
    );
    await deployer.fetchValue(proxy);
    console.log(
      name,
      proxy,
      initValue[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE],
      valueChangeSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE],
      tickSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]
    );
    await deployer.MockContract(
      name,
      proxy,
      // @ts-ignore
      initValue[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE],
      // @ts-ignore
      valueChangeSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE],
      // @ts-ignore
      tickSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]
    );
    await deployer.fetchValue(proxy);

    console.log(chalk.blue(`Let's get to work 💼 😏 ...`));
    console.log(chalk.yellow(figlet.textSync("Celebrate")));
    console.log(chalk.blue(`You are a shadowy super code 🔥 ✨ 😏 ...`));
  },
};
