"use strict";
module.exports = {
    CHAINLINK_AGGREGATOR_ABI: [
        "function proposeAggregator(address _aggregator) external",
        "function confirmAggregator(address _aggregator) external",
        "function aggregator() external view returns (address)",
        "function owner() external view returns (address)",
        "function latestRoundData() public view virtual override returns (uint80 roundId,int256 answer,uint256 startedAt,uint256 updatedAt,uint80 answeredInRound)",
    ],
};
//# sourceMappingURL=abi.js.map