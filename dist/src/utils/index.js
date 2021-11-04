"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cli_table_1 = __importDefault(require("cli-table"));
const chalk_1 = __importDefault(require("chalk"));
module.exports = {
    logTable: function logTable(headers, data) {
        let table = new cli_table_1.default({
            head: headers,
            colWidths: headers.map((h) => 45),
        });
        table.push(data);
        console.log(table.toString());
    },
    logBlue: function logBlue(data) {
        console.log(chalk_1.default.blue(data));
    },
    logGreen: function logGreen(data) {
        console.log(chalk_1.default.green(data));
    },
    logYellow: function logYellow(data) {
        console.log(chalk_1.default.yellow(data));
    },
    targetKey: function targetKey(pairSelectionParsed) {
        return pairSelectionParsed.split(".")[0];
    },
};
//# sourceMappingURL=index.js.map