// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
//import "@chainlink/contracts/src/v0.7/interfaces/AggregatorProxyInterface.sol";

contract AggregatorMainupulator is AggregatorV3Interface {

    // used to mimick orignal aggregator behavior when needed
    AggregatorV3Interface internal originAggr;

    constructor(address originAggrAddr) public {
        originAggr = AggregatorV3Interface(originAggrAddr);
    }

    /*
     Implement AggregatorV3Interface:
    */
    function decimals() public view override returns (uint8) {
        return originAggr.decimals();
    }

    function description() public view override returns (string memory) {
        return originAggr.description();
    }

    function version() view public override returns (uint256) {
        return originAggr.version();
    }

    // getRoundData and latestRoundData should both raise "No data present"
    // if they do not have data to report, instead of returning unset values
    // which could be misinterpreted as actual reported values.
    function getRoundData(uint80 _roundId) view public override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) {
           return originAggr.getRoundData(_roundId);
        }

    function latestRoundData() public view override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) {
            return originAggr.latestRoundData();
        }
}
