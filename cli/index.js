const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require("inquirer");
const PriceFeeds = require("../chainlink-data-feeds");

const QUESTION_PROMPT_NAMES = {
    HIJACKABLE_FEEDS: 'Hijackable Price Feeds',
    MOCK_AGGREGATOR_SELECTION: 'Mock Aggregator Selection',
}

module.exports = {
    welcomeMessage: async function () {
        clear();

        console.log(
            chalk.green(
                "🎉 ✨ 🔥 Hijacked Chainlink Oracles by: 🎉 ✨ 🔥"
            )
        );
        console.log(
            chalk.blue(
                figlet.textSync('Chaos Labs')
            )
        );
        await this.selectTokenPairPricesToMock();
    },
    selectTokenPairPricesToMock: async function selectTokenPairPricesToMock() {
        // ******************** GET PRICE FEED ********************
        const pricefeeds = await PriceFeeds.getEthereumProxiesForNetwork();
        const subsetPFs = pricefeeds
            .slice(0, 4)
            .map((pair, i) => (`${i}. ${pair.pair}`));
        subsetPFs.push("5. Search specific pairs")
        let questions = [
            {
                type: 'rawlist',
                name: QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS,
                message: 'Select price feeds:',
                choices: subsetPFs,
                default: []
            }
        ];
        const pairSelection = await inquirer.prompt(questions);
        const pairSelectionParsed = pairSelection[QUESTION_PROMPT_NAMES.HIJACKABLE_FEEDS];
        console.log(chalk.blue("You selected " + pairSelectionParsed));

        // ******************** GET MOCK FN ********************
        questions = [
            {
                type: 'checkbox',
                name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION,
                message: 'Select a function for the Mock Oracle',
                choices: ["Constant", "Incremental", "Multiply", "Original"],
                default: []
            }
        ];
        const mockFnSelection = await inquirer.prompt(questions);
        console.log(chalk.blue("You selected " + mockFnSelection[QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION]));
        
        // ******************** GET ADDRESS FOR MOCK ********************
        console.log(chalk.blue(`Hijacking pair proxy ${pairSelectionParsed.substring(3)} at address ${pricefeeds[0].proxy}`));

        console.log(chalk.blue(`Let's get to work 💼 😏 ...`));
        console.log(
            chalk.yellow(
                figlet.textSync('Celebrate')
            )
        );
        console.log(chalk.blue(`You are a shadowy super code 🔥 ✨ 😏 ...`));
    },
}