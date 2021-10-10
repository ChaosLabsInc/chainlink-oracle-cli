// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract AggregatorMainupulator is AggregatorV3Interface {
    // used to mimick orignal aggregator behavior when needed
    AggregatorV3Interface internal originAggr;
    // underlying mocking aggregator
    AggregatorV3Interface internal mockAggr;

    constructor(address originAggrAddr) public {
        originAggr = AggregatorV3Interface(originAggrAddr);
        mockAggr = AggregatorV3Interface(0);
    }

    //used to set underlying mocking aggregator to replace the original behaior
    function setMockAggregator(address mockAggrAddr) public {
        mockAggr = AggregatorV3Interface(mockAggrAddr);
    }

    // used to query underlying mock aggregator
    function getMockAggrAddress() public view returns (address) {
        return address(mockAggr);
    }

    /*
     Implement AggregatorV3Interface:
    */
    function decimals() public view override returns (uint8) {
        if (address(mockAggr) != address(0)) {
            return mockAggr.decimals();
        }
        return originAggr.decimals();
    }

    function description() public view override returns (string memory) {
        if (address(mockAggr) != address(0)) {
            return mockAggr.description();
        }
        return originAggr.description();
    }

    function version() public view override returns (uint256) {
        if (address(mockAggr) != address(0)) {
            return mockAggr.version();
        }
        return originAggr.version();
    }

    // getRoundData and latestRoundData should both raise "No data present"
    // if they do not have data to report, instead of returning unset values
    // which could be misinterpreted as actual reported values.
    function getRoundData(uint80 _roundId)
        public
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        if (address(mockAggr) != address(0)) {
            return mockAggr.getRoundData(_roundId);
        }
        return originAggr.getRoundData(_roundId);
    }

    function latestRoundData()
        public
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        if (address(mockAggr) != address(0)) {
            return mockAggr.latestRoundData();
        }
        return originAggr.latestRoundData();
    }
}
