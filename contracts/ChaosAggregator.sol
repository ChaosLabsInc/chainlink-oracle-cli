pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "./console.sol";

contract ChaosAggregator is AggregatorV3Interface {
    AggregatorV3Interface internal priceFeed;
    uint256 internal versionInternal = 1;
    uint8 internal decimalsInternal = 2;
    string internal descriptionInternal = "A magnificent aggregator";

    /**
     * Network: Mainnet
     * Aggregator: ETH/USD
     * Address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
     */
    constructor() public {
        priceFeed = AggregatorV3Interface(
            0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        );
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return 0;
    }

    /**
     * Returns the latest price
     */
    function decimals() external view override returns (uint8) {
        return decimalsInternal;
    }

    function description() external view override returns (string memory) {
        return descriptionInternal;
    }

    function version() external view override returns (uint256) {
        return versionInternal;
    }

    // getRoundData and latestRoundData should both raise "No data present"
    // if they do not have data to report, instead of returning unset values
    // which could be misinterpreted as actual reported values.
    function getRoundData(uint80 _roundId)
        external
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
        return (1, 0, 10, 10, 10);
    }

    function latestRoundData()
        external
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
        return (1, 0, 10, 10, 10);
    }
}
