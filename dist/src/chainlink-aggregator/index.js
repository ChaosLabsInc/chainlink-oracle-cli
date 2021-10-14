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
const abi_1 = __importDefault(require("../abi/abi"));
module.exports = {
    genChainLinkAggregatorContract: function genChainLinkAggregatorContract(chainlinkAggregatorAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return new hardhat_1.ethers.Contract(chainlinkAggregatorAddress, abi_1.default.CHAINLINK_AGGREGATOR_ABI, hardhat_1.ethers.provider);
        });
    },
};
//# sourceMappingURL=index.js.map