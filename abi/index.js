module.exports = {
    CHAINLINK_AGGREGATOR_ABI: [
        "function proposeAggregator(address _aggregator) external",
        "function confirmAggregator(address _aggregator) external",
        "function aggregator() external view returns (address)",
        "function owner() external view returns (address)",
    ],
}