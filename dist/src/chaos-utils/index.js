"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// const Table = require("cli-table");
const cli_table_1 = __importDefault(require("cli-table"));
module.exports = {
    logTable: function logTable(headers, data) {
        let table = new cli_table_1.default({
            head: headers,
            colWidths: headers.map((h) => 45),
        });
        table.push(data);
        console.log(table.toString());
    },
};
//# sourceMappingURL=index.js.map