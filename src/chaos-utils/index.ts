// const Table = require("cli-table");
import Table from "cli-table";

export = {
  logTable: function logTable(headers: string[], data: string[]) {
    let table = new Table({
      head: headers,
      colWidths: headers.map((h) => 45),
    });
    table.push(data);
    console.log(table.toString());
  },
};
