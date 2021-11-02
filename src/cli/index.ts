import deployer from "../deploy/deploy";
import figlet from "figlet";
import clear from "clear";
import inquirer from "inquirer";
import PriceFeeds from "../chainlink-data-feeds";
import Questions from "../questions";
import Utils from "../utils";
import chalk from "chalk";

type PriceFeed = {
  pair: string; // '1INCH / ETH'
  proxy: string; // 0xwgmi
};

function contactName(name: string) {
  return "Aggregator" + name;
}

const YOU_SELECTED = "You selected ";
const { targetKey } = Utils;

export = {
  welcomeMessage: async function () {
    clear();
    console.log(chalk.green("🎉 ✨ 🔥 Configured Chainlink Oracles by: 🎉 ✨ 🔥"));
    console.log(chalk.blue(figlet.textSync("Chaos Labs")));
  },
  getEthereumProxiesForNetwork: async function getEthereumProxiesForNetwork(): Promise<{
    priceFeeds: Array<any>;
    tokenPairsSliced: Array<any>;
    inquirerChoices: Array<any>;
  }> {
    const priceFeeds = await PriceFeeds.getEthereumProxiesForNetwork();
    const tokenPairsSliced = priceFeeds.map((pair: any) => `${pair.pair}`);
    const inquirerChoices = [...tokenPairsSliced.slice(0, 4), "View full list", "Search by ticker"];
    return {
      priceFeeds,
      tokenPairsSliced,
      inquirerChoices,
    };
  },
  selectTokenPairPricesToMock: async function selectTokenPairPricesToMock(): Promise<{
    pairSelectionParsed: string;
    priceFeeds: Array<any>;
  }> {
    const { priceFeeds, tokenPairsSliced, inquirerChoices } = await this.getEthereumProxiesForNetwork();
    let pairSelection: any = await inquirer.prompt(Questions.getConfigurablePriceFeedsQuestion(inquirerChoices));
    let pairSelectionParsed = pairSelection[Questions.QUESTION_NAMES.CONFIGURABLE_FEEDS];
    if (Questions.showAllPriceFeedsSelected(pairSelectionParsed)) {
      pairSelection = await inquirer.prompt<number>(Questions.getAllPriceFeedsQuestion(tokenPairsSliced));
      pairSelectionParsed = pairSelection[Questions.QUESTION_NAMES.CONFIGURABLE_FEEDS];
    } else if (Questions.showSearchPriceFeedsSelected(pairSelectionParsed)) {
      // TODO:
    }
    console.log(chalk.blue(YOU_SELECTED + pairSelectionParsed));
    return { pairSelectionParsed, priceFeeds };
  },
  selectMockFunction: async function selectMockFunction(): Promise<any> {
    const mockFnSelection: any = await inquirer.prompt(Questions.getMockFunctionQuestion());
    console.log(chalk.blue(YOU_SELECTED + mockFnSelection[Questions.QUESTION_NAMES.MOCK_AGGREGATOR_SELECTION]));
    return mockFnSelection[Questions.QUESTION_NAMES.MOCK_AGGREGATOR_SELECTION];
  },
  selectInitialValue: async function selectInitialValue(): Promise<any> {
    const initValue = await inquirer.prompt(Questions.getSelectInitialValueQuestion());
    console.log(chalk.blue(YOU_SELECTED + initValue[Questions.QUESTION_NAMES.MOCK_AGGREGATOR_BASE_VALUE]));
    return initValue;
  },
  selectPriceChange: async function selectPriceChange(): Promise<any> {
    const valueChangeSelection = await inquirer.prompt(Questions.getPriceChangeQuestion());
    console.log(chalk.blue(YOU_SELECTED + valueChangeSelection[Questions.QUESTION_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE]));
    return valueChangeSelection;
  },
  selectBlockUpdateIntervalSize: async function selectBlockUpdateIntervalSize(): Promise<any> {
    const blockUpdate = await inquirer.prompt(Questions.getPriceChangeFrequency());
    console.log(chalk.blue(YOU_SELECTED + blockUpdate[Questions.QUESTION_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]));
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
      initValue[Questions.QUESTION_NAMES.MOCK_AGGREGATOR_BASE_VALUE],
      valueChangeSelection[Questions.QUESTION_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE],
      tickSelection[Questions.QUESTION_NAMES.MOCK_AGGREGATOR_CHANGE_PACE]
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
