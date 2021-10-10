const Table = require('cli-table');

module.exports = {
    logTable: function logTable(headers, data) {
        let table = new Table({
            head: headers,
            colWidths: [60, 60]
        });
        table.push(
            data
        );
        console.log(table.toString());
    }
}