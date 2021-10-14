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
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe("PriceConsumerV3", function () {
    let priceConsumerV3;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        let PriceConsumerV3 = yield hardhat_1.ethers.getContractFactory("PriceConsumerV3");
        priceConsumerV3 = yield PriceConsumerV3.deploy();
        yield priceConsumerV3.deployed();
    }));
    it("Should be able to successfully get round data", function () {
        return __awaiter(this, void 0, void 0, function* () {
            (0, chai_1.expect)(yield priceConsumerV3.getLatestPrice()).not.be.null;
        });
    });
});
//# sourceMappingURL=cosumer.js.map