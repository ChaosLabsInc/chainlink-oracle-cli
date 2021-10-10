// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract AggregatorConstant is AggregatorV3Interface {
    // mocked values returned by contract:
    uint80 internal s_roundId;
    int256 internal s_answer;
    uint256 internal s_startedAt;
    uint256 internal s_updatedAt;
    uint80 internal s_answeredInRound;

    constructor(uint80  roundId, int256  answer,uint256 startedAt,uint256 updatedAt,uint80 answeredInRound ) public {
        s_roundId= roundId;
        s_answer= answer;
        s_startedAt = startedAt;
        s_updatedAt= updatedAt;
        s_answeredInRound = answeredInRound;
    }
    
    // Used to modoify mocking values
    function setValues(uint80  roundId, int256  answer,uint256 startedAt,uint256 updatedAt,uint80 answeredInRound ) public {
        s_roundId= roundId;
        s_answer= answer;
        s_startedAt = startedAt;
        s_updatedAt= updatedAt;
        s_answeredInRound = answeredInRound;
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

    function version() view public override returns (uint256) {
        return 0;
    }


    function getRoundData(uint80 _roundId) view public override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) {
           return (_roundId,s_answer,s_startedAt,s_updatedAt,s_answeredInRound);
        }

    function latestRoundData() public view override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) {
            return (s_roundId,s_answer,s_startedAt,s_updatedAt,s_answeredInRound);
        }
}
