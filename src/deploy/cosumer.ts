import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("PriceConsumerV3", function () {
  let priceConsumerV3: Contract;
  beforeEach(async () => {
    let PriceConsumerV3 = await ethers.getContractFactory("PriceConsumerV3");
    priceConsumerV3 = await PriceConsumerV3.deploy();
    await priceConsumerV3.deployed();
  });

  it("Should be able to successfully get round data", async function () {
    expect(await priceConsumerV3.getLatestPrice()).not.be.null;
  });
});
