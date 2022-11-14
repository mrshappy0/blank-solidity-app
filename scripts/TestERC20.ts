import { ethers } from "hardhat";

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
