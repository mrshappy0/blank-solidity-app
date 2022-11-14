import { expect } from "chai";
import { ethers } from "hardhat";
import { HelloWorld } from "../typechain-types";

// let assert = require("assert");
describe("Hello World", () => {
  let helloWorldContract: HelloWorld;
  beforeEach(async ()=>{
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    helloWorldContract = await helloWorldFactory.deploy() as HelloWorld;
    await helloWorldContract.deployed();
  })
  it("should give a Hello World message", async () => {
     const helloWorldText = await helloWorldContract.helloWorld();
    expect(helloWorldText).to.eq("Hello World");
  });

  it("it should set the owner as the deployer", async () => {
    const accounts = await ethers.getSigners();
    const contractOwner = await helloWorldContract.owner();
    expect(contractOwner).to.eq(accounts[0].address);
  });
});
