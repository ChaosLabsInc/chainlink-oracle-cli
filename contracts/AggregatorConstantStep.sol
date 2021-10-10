// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

/*
 * A Mocker contract that returns incremental/decremental answer every X blocks as set by values
 */
contract AggregatorConstantStep is AggregatorV3Interface {
    // mocked values returned by contract:
    uint80 internal s_roundId;
    int256 internal s_answer;
    uint256 internal s_startedAt;
    uint256 internal s_updatedAt;
    uint80 internal s_answeredInRound;

    // stepChange - added to base value multiplied by ( blocks changed / stepBlocks) to set a pace to change.
    int256 internal s_stepChange;
    // stepBlocks - sets the pace of value change, the amounts of blocks between every change applied to value.
    uint256 internal s_stepBlocks;
    // block - the block at the last time the values were changed, where we start the count from.
    uint256 internal s_block;

    constructor(
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound,
        int256 stepChange,
        uint256 stepBlocks
    ) public {
        s_roundId = roundId;
        s_answer = answer;
        s_startedAt = startedAt;
        s_updatedAt = updatedAt;
        s_answeredInRound = answeredInRound;
        s_stepChange = stepChange;
        s_stepBlocks = stepBlocks;
        s_block = block.number;
    }

    // Used to modoify mocking values
    function setValues(
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound,
        int256 stepChange,
        uint256 stepBlocks
    ) public {
        s_roundId = roundId;
        s_answer = answer;
        s_startedAt = startedAt;
        s_updatedAt = updatedAt;
        s_answeredInRound = answeredInRound;
        s_stepChange = stepChange;
        s_stepBlocks = stepBlocks;
        s_block = block.number;
    }

    /*
     Implement AggregatorV3Interface:
    */
    function decimals() public view override returns (uint8) {
        return 0;
    }

    function description() public view override returns (string memory) {
        return "constant value aggregator mocker";
    }

    function version() public view override returns (uint256) {
        return 0;
    }

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
        int256 mocked_answer = s_answer +
            s_stepChange *
            int256(((block.number - s_block) / s_stepBlocks));
        return (
            _roundId,
            mocked_answer,
            s_startedAt,
            s_updatedAt,
            s_answeredInRound
        );
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
        int256 mocked_answer = s_answer +
            s_stepChange *
            int256(((block.number - s_block) / s_stepBlocks));
        return (
            s_roundId,
            mocked_answer,
            s_startedAt,
            s_updatedAt,
            s_answeredInRound
        );
    }
}
