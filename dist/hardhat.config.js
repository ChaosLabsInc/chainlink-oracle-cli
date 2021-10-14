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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
(0, config_1.task)("accounts", "Prints the list of accounts", (args, hre) => __awaiter(void 0, void 0, void 0, function* () {
    const accounts = yield hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(yield account.address);
    }
}));
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
exports.default = {
    solidity: "0.6.6",
};
//# sourceMappingURL=hardhat.config.js.map