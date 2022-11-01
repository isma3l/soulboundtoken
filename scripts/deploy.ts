import { ethers } from "hardhat";

async function main() {
  const soulBoundTokenFactory  = await ethers.getContractFactory('SoulBoundToken');
  const soulBoundToken = await soulBoundTokenFactory.deploy();

  await soulBoundToken.deployed();

  console.log(`Contract deployed to ${soulBoundToken.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
