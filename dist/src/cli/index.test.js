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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const CLI_TEST_SUITE = "CLI_TEST_SUITE ";
test(`${CLI_TEST_SUITE} - welcomeMessage`, () => __awaiter(void 0, void 0, void 0, function* () {
    // should not return value
    expect(yield index_1.default.welcomeMessage()).toBe(undefined);
}));
describe(`${CLI_TEST_SUITE} - getEthereumProxiesForNetwork`, () => {
    it("returns the pairSelection and priceFeeds ", () => __awaiter(void 0, void 0, void 0, function* () {
        const { priceFeeds, inquirerChoices } = yield index_1.default.getEthereumProxiesForNetwork();
        expect(Array.isArray(priceFeeds)).toBeTruthy();
        expect(priceFeeds.length).toBeGreaterThan(0);
        expect(Array.isArray(inquirerChoices)).toBeTruthy();
        expect(inquirerChoices.length).toBeGreaterThan(0);
    }));
});
//# sourceMappingURL=index.test.js.map