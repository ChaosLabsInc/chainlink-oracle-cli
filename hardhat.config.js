require("@nomiclabs/hardhat-waffle")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "chaos",
  networks: {
    chaos: {
      url: process.env.ALCHEMY_MAINNET_RPC_URL,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        accountsBalance: "10000000000000000000000",
      }
    },
  },
  solidity: "0.6.6",
}

