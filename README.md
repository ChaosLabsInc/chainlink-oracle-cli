![Chaos Labs - Chainlink Collab](https://github.com/ChaosLabsInc/chaos-labs-chainlink/blob/master/img/ChaosLabsChainlink.jpg)

This repository hosts a CLI utitlity for mocking Chainlink Oracle prices in a local hardhat mainnet fork testing environment. Navigate to our [Quickstart](#quickstart) section to get the repo up and running.

For a full deep dive to the project architecture please visit the [Chaos Labs blog](https://chaoslabs.xyz/blog/mock-chainlink-oroacles-pt-1).

## Use Cases

DeFi protocols and applications are at high risk due to volatile market conditions and a myriad of security vectors. Mocking Chainlink Oracle return values in a controlled, siloed testing environment allows us to address 2 common vectors.

**Volatile Market Conditions**

Volatility is a DeFi constant and is something that all protocols and applications should test for thoroughly. Internal application and protocol state is often a direct result of Oracle returns values. To further illustrate this let's use an example.

Imagine a lending protocol (Maker, AAVE, Benqi, Spectral.finance, etc..) that accepts Ethereum as collateral against stablecoin loans. What happens on a day like Black Thursday, when Ethereum prices cascade negatively to the tune of ~70% in a 48 hour time frame? Well, a lot of things happen 🤦. One critical aspect of responding to market volatiltiy is protocol keepers triggering liquidations and thus ensuring protocol solvency.

With the ability to control Oracle return values, simulating such scenarios in your local development environment is possible.

**Oracle Manipulation**

Oracle manipulation is an additional attack vector. With this method, malicious actors research data sources that various oracle consume as sources of truth. When actors possess the ability to manipulate the underlying data source they trigger downstream effects, manifesting in altered Oracle return values. As a result of manipulated data, actors and contracts can trigger various unwanted behaviours such as modified permissions, transaction execution, emergency pausing / shutdown and more.

With the ability to manipulate Chainlink Oracle return values, simulating such scenarios in your local development environment is possible.

## <a name="quickstart"></a> Prerequisities && QuickStart

1. `ts-node` to run typescript (`npm i -G ts-node`)
2. Alchemy API key for mainnet fork access
3. `npm i` - Installing project libs.
4. `npx hardhat compile` - Compiling solidity contracts
5. `npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<YOUR_KEY>` - Spinning a mainnet fork locally.
6. `ts-node --files index.ts` - Start CLI!(--files can be permenantly replace with `export TS_NODE_FILES=true`)

## Recommended Usage

This repo is meant to serve as an implementation spec for mocking oracle return values. This is a resource and reference for smart contract developers to implement such strategies and practices as part of their development lifecycle.

## Example Flow

1. Select a price feed to configure / mock (ETH/USD, SNX/DAI etc...)

2. Select a mock function which will determine the Chainlink Aggregator Proxy return values

3. Set Initial value of Chainlink Oracle in the context of the simulation

4. Select the price delta in each tick and tick size (how often (in blocks) should the price update):

5. Deploy 🤝 💥

![Example Flow](https://github.com/ChaosLabsInc/chaos-labs-chainlink/blob/master/img/ExampleFlow.png)

## PR Requests

- Ganache support
- CLI improvements. Have an idea to make this repo more user friendly? Let us know, or better yet, make a pull request :)
