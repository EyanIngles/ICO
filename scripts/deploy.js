
const hre = require("hardhat");

async function main() {
  const NAME = 'Ease v1'
  const SYMBOL = 'ESE'
  const MAX_SUPPLY = '1000000'
  const PRICE = ethers.utils.parseUnits('0.0025', 'ether')

  const Token = await hre.ethers.getContractFactory("Token")
  let token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)
  await token.deployed()
  console.log(`Token deployed to: ${token.address}\n`)

  const Crowdsale = await hre.ethers.getContractFactory("Crowdsale")
  let crowdsale = await Crowdsale.deploy(token.address, PRICE, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'))
  await crowdsale.deployed()

  console.log(`Crowdsale deployed to: ${crowdsale.address}\n`)

  let transaction = await token.transfer(crowdsale.address, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'))
  await transaction.wait()
  console.log()

  console.log('Tokens deployed to crowdsale \n')
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
