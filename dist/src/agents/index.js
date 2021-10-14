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
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const hardhat_2 = __importDefault(require("hardhat"));
const { ETH_WHALE_ADDRESS } = require("constants");
module.exports = {
    getBalanceForAddress: function getBalanceForAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const bal = yield hardhat_1.ethers.provider.getBalance(address);
            return hardhat_1.ethers.utils.formatEther(bal);
        });
    },
    sendEthFromTo: function sendEthFromTo(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield hardhat_2.default.network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [from],
                });
                const signer = yield hardhat_1.ethers.provider.getSigner(from);
                yield signer.sendTransaction({
                    from,
                    to,
                    value: ethers_1.utils.parseEther("10"),
                });
                yield hardhat_2.default.network.provider.request({
                    method: "hardhat_stopImpersonatingAccount",
                    params: [from],
                });
            }
            catch (e) {
                throw new Error(`Failed to send Chainlink aggregator owner ETH...[${e}]`);
            }
        });
    },
    impersonateAndGetSigner: function impersonateAndGetSigner(impersonateMe) {
        return __awaiter(this, void 0, void 0, function* () {
            yield hardhat_2.default.network.provider.request({
                method: "hardhat_impersonateAccount",
                params: [impersonateMe],
            });
            const ownerSigner = yield hardhat_1.ethers.getSigner(impersonateMe);
            return ownerSigner;
        });
    },
    stopImpersonateAccount: function stopImpersonateAccount(stopImpersonateMe) {
        return __awaiter(this, void 0, void 0, function* () {
            yield hardhat_2.default.network.provider.request({
                method: "hardhat_stopImpersonatingAccount",
                params: [stopImpersonateMe],
            });
        });
    },
};
//# sourceMappingURL=index.js.map