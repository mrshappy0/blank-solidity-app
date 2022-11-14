import { ethers } from "hardhat";

const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

async function main() {
  const accounts = await ethers.getSigners();
  const tokenContractFactory = await ethers.getContractFactory("MyToken");
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.deployed();
  console.log(`Contract deployed at ${tokenContract.address}`);

  // fetch role code
  const minterRoleCode = await tokenContract.MINTER_ROLE();

  // Give role
  const roleTx = await tokenContract.grantRole(
    minterRoleCode,
    accounts[2].address
  );
  await roleTx.wait();

  // mint tokens
  const mintTx = await tokenContract
    .connect(accounts[2])
    .mint(accounts[0].address, 2);
  await mintTx.wait();

  // send transaction
  const tx = await tokenContract.transfer(accounts[1].address, 1);
  await tx.wait();

  const [name, symbol, decimals, totalSupply] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals(),
    tokenContract.totalSupply(),
  ]);
  console.log({
    name,
    symbol,
    decimals,
    totalSupply,
  });

  const myBalance = await tokenContract.balanceOf(accounts[0].address);
  console.log(`My balance is ${myBalance}`);
  const otherBalance = await tokenContract.balanceOf(accounts[1].address);
  console.log(`The balance of account 1 is ${otherBalance}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
