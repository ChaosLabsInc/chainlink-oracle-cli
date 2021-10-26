import { targetKey } from "./utils";
export const QUESTION_PROMPT_NAMES = {
  CONFIGURABLE_FEEDS: "Configurable Price Feeds",
  MOCK_AGGREGATOR_SELECTION: "Mock Aggregator Selection",
  MOCK_AGGREGATOR_BASE_VALUE: "Mock Intial Value",
  MOCK_AGGREGATOR_VALUE_CHANGE: "Mock Value Change",
  MOCK_AGGREGATOR_CHANGE_PACE: "Mock Change Pace",
};

export const getConfigurablePriceFeedsQuestion = (choices: Array<string>) => {
  return [
    {
      type: "rawlist",
      name: QUESTION_PROMPT_NAMES.CONFIGURABLE_FEEDS,
      message: "Select price feed:",
      choices,
      default: [],
    },
  ];
};

export const getAllPriceFeedsQuestion = (tokenPairsSliced: Array<string>) => {
  return [
    {
      type: "rawlist",
      name: QUESTION_PROMPT_NAMES.CONFIGURABLE_FEEDS,
      message: "All price feeds:",
      choices: tokenPairsSliced,
    },
  ];
};

export const getSelectInitialValueQuestion = () => {
  return [
    {
      type: "number",
      name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_BASE_VALUE,
      message: "Select intial value of mock",
      default: [0], //TODO - current value retrieved.
    },
  ];
};

export const getPriceChangeQuestion = () => {
  return [
    {
      type: "number",
      name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_VALUE_CHANGE,
      message: "Select the change in price each tick",
      default: [0],
    },
  ];
};

export const getPriceChangeFrequency = () => {
  return [
    {
      type: "number",
      name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_CHANGE_PACE,
      message: "Select price update frequency - counted in mined blocks ",
      default: [0],
    },
  ];
};

export const getMockFunctionQuestion = () => {
  return [
    {
      type: "list",
      name: QUESTION_PROMPT_NAMES.MOCK_AGGREGATOR_SELECTION,
      message: "Select a function for the Mock Oracle",
      choices: ["Constant", "Incremental", "Volatile", "Original"],
      default: [],
    },
  ];
};

export const showAllPriceFeedsSelected = (pairSelectionParsed: string) => {
  return targetKey(pairSelectionParsed) == "6";
};

export const showSearchPriceFeedsSelected = (pairSelectionParsed: string) => {
  return targetKey(pairSelectionParsed) == "7";
};
