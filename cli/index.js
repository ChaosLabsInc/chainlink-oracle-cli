const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const inquirer = require("inquirer");
const PriceFeeds = require("../chainlink-data-feeds");
const { deployMockerContract } = require("../scripts/deploy");
const delpoyer = require("../scripts/deploy");

const QUESTION_PROMPT_NAMES = {
  HIJACKABLE_FEEDS: "Hijackable Price Feeds",
  MOCK_AGGREGATOR_SELECTION: "Mock Aggregator Selection",
};

function contactName(name) {
  return "Aggregator" + name;
}

function targetKey(pairSelectionParsed) {
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
    const subsetPFs = pricefeeds.slice(0, 4).map((pair, i) => `${i}. ${pair.pair}`);

    subsetPFs.push("5. Search specific pairs");
    let questions = [
      {
        type: "rawlist",
        name: QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS,
        message: "Select price feeds:",
        choices: subsetPFs,
        default: [],
      },
    ];
    const pairSelection = await inquirer.prompt(questions);
    const pairSelectionParsed = pairSelection[QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS];
    console.log(chalk.blue("You selected " + pairSelectionParsed));

    // ******************** GET MOCK FN ********************
    questions = [
      {
        type: "checkbox",
        name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION,
        message: "Select a function for the Mock Oracle",
        choices: ["Constant", "Incremental", "Volatile", "Original"],
        default: [],
      },
    ];
    const mockFnSelection = await inquirer.prompt(questions);
    console.log(chalk.blue("You selected " + mockFnSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION]));
    // ******************** GET ADDRESS FOR MOCK ********************

    let originAddress = pricefeeds[targetKey(pairSelectionParsed)].proxy;
    let name = contactName(mockFnSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION]);
    console.log(
      chalk.blue(
        `Hijacking pair proxy ${pairSelectionParsed.substring(
          targetKey(pairSelectionParsed)
        )} at address ${originAddress}`
      )
    );
    await delpoyer.fetchValue(); //TODO - pass in chosen currency and update contract to support dynmic currency
    await delpoyer.MockContract(name, originAddress, 0, 0, 0);

    console.log(chalk.blue(`Let's get to work 💼 😏 ...`));
    console.log(chalk.yellow(figlet.textSync("Celebrate")));
    console.log(chalk.blue(`You are a shadowy super code 🔥 ✨ 😏 ...`));
  },
};
