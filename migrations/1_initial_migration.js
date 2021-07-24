const Migrations = artifacts.require("Migrations");
const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");
const Yuvan = artifacts.require("Yuvan");
const Nft = artifacts.require("Nft");
const Auction = artifacts.require("Auction");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(Token);
  await deployer.deploy(Yuvan);
  await deployer.deploy(Nft);
  const token = await Token.deployed();
  const yuvan = await Yuvan.deployed();
  const nft = await Nft.deployed();

  await deployer.deploy(EthSwap,token.address,yuvan.address);
  const ethSwap = await EthSwap.deployed();

  await deployer.deploy(Auction,yuvan.address);
  const auction = await Auction.deployed();

  await token.transfer(ethSwap.address,'1000000000000000000000000');
  await yuvan.transfer(ethSwap.address,'1000000000000000000000000');
};