const cli = require("./dist/src/cli");

async function main() {
  await cli.welcomeMessage();
}

main();
