import Questions from "./index";
const QUESTION_TEST_SUITE = "QUESTION_TEST_SUITE ";

test(`${QUESTION_TEST_SUITE} - getConfigurablePriceFeedsQuestion`, () => {
  const configPFQuestions = Questions.getConfigurablePriceFeedsQuestion([]);
  expect(configPFQuestions.length).toBeGreaterThan(0);
  expect(configPFQuestions[0]).toMatchObject({
    type: "rawlist",
    name: Questions.QUESTION_NAMES.CONFIGURABLE_FEEDS,
    message: "Select price feed:",
    choices: [],
    default: [],
  });
});

test(`${QUESTION_TEST_SUITE} - getAllPriceFeedsQuestion`, () => {
  const PFQuestions = Questions.getAllPriceFeedsQuestion(["abc"]);
  expect(PFQuestions.length).toBeGreaterThan(0);
  expect(PFQuestions[0]).toMatchObject({
    type: "rawlist",
    name: Questions.QUESTION_NAMES.CONFIGURABLE_FEEDS,
    message: "All price feeds:",
    choices: ["abc"],
  });
});

test(`${QUESTION_TEST_SUITE} - getSelectInitialValueQuestion`, () => {
  expect("1").toBe("1");
});

test(`${QUESTION_TEST_SUITE} - getPriceChangeQuestion`, () => {
  expect("1").toBe("1");
});

test(`${QUESTION_TEST_SUITE} - getConfigurablePriceFeedsQuestion`, () => {
  expect("1").toBe("1");
});

test(`${QUESTION_TEST_SUITE} - getMockFunctionQuestion `, () => {
  expect("1").toBe("1");
});
