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
const axios_1 = __importDefault(require("axios"));
const CHAINLINK_DOCS_CONSTANTS = {
    ETHEREUM_ADDRESSES_ENDPOINT: "https://cl-docs-addresses.web.app/addresses.json",
    ETHEREUM_NETWORKS: {
        MAINNET: "Ethereum Mainnet",
        KOVAN: "Kovan Testnet",
        RINKEBY: "Rinkeby Testnet",
    },
    PAYLOAD_KEYS: {
        ARBITRUM: "arbitrum-price-feeds",
        ETHEREUM: "ethereum-addresses",
        BSC: "binance-smart-chain-addresses-price",
        FANTOM: "fantom-price-feeds",
        MATIC: "matic-addresses",
        SOLANA: "solana-price-feeds",
    },
};
module.exports = {
    getAllPriceFeeds: function getAllPriceFeeds() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const priceFeedPayload = yield axios_1.default.get(CHAINLINK_DOCS_CONSTANTS.ETHEREUM_ADDRESSES_ENDPOINT);
                const priceFeedData = priceFeedPayload.data;
                return priceFeedData[CHAINLINK_DOCS_CONSTANTS.PAYLOAD_KEYS.ETHEREUM];
            }
            catch (e) {
                throw new Error(`Failed to fetch all price feeds...[${e}]`);
            }
        });
    },
    getEthereumProxiesForNetwork: function getEthereumProxiesForNetwork(network = "Ethereum Mainnet") {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const priceFeedPayload = yield axios_1.default.get(CHAINLINK_DOCS_CONSTANTS.ETHEREUM_ADDRESSES_ENDPOINT);
                const priceFeedData = priceFeedPayload.data;
                const etherumPriceFeeds = priceFeedData[CHAINLINK_DOCS_CONSTANTS.PAYLOAD_KEYS.ETHEREUM];
                const foundNetwork = etherumPriceFeeds.networks.find((n) => n.name === network);
                if (foundNetwork === undefined) {
                    throw new Error(`Could not find ${network} while searching networks`);
                }
                const proxies = foundNetwork.proxies;
                return proxies;
            }
            catch (e) {
                throw new Error(`Failed to fetch all price feeds...[${e}]`);
            }
        });
    },
    getArbitrumPriceFeeds: function getArbitrumPriceFeeds() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    getAvalanchePriceFeeds: function getAvalanchePriceFeeds() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    getBSCPriceFeeds: function getBSCPriceFeeds() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    getEthereumPriceFeeds: function getEthereumPriceFeeds() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    getFantomPriceFeeds: function getFantomPriceFeeds() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    getMaticPriceFeeds: function getMaticPriceFeeds() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    getSolanaPriceFeeds: function getSolanaPriceFeeds() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
};
//# sourceMappingURL=index.js.map