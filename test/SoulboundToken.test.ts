import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SoulBoundToken", () => {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture() {
        const soulBoundTokenFactory  = await ethers.getContractFactory('SoulBoundToken');
        const soulBoundToken = await soulBoundTokenFactory.deploy();
        await soulBoundToken.deployed();

        // Contracts are deployed using the first signer/account by default
        const [owner, secondAccount, thirdAccount] = await ethers.getSigners();
        return { soulBoundToken, owner, secondAccount, thirdAccount };
    }

    describe("Deployment", () => {
        it("Should set the right owner", async function () {
            const { soulBoundToken, owner } = await loadFixture(deployOneYearLockFixture);
      
            expect(await soulBoundToken.owner()).to.equal(owner.address);
          });
    });

    describe("Minting of SBT", () => {
        it('Only the issuer can mint SBTs', async () => {
            const { soulBoundToken, secondAccount } = await loadFixture(deployOneYearLockFixture);
                    
            expect(await soulBoundToken.balanceOf(secondAccount.address)).to.equal(0);
            await soulBoundToken.safeMint(secondAccount.address, "URI");
            expect(await soulBoundToken.balanceOf(secondAccount.address)).to.equal(1);
            const tokenId = 0;
            expect(await soulBoundToken.ownerOf(tokenId)).to.equal(secondAccount.address);
        });

        it('Another account different from the issuer cannot mint SBTs', async () => {
            const { soulBoundToken, secondAccount, thirdAccount } = await loadFixture(deployOneYearLockFixture);
                    
            await expect(soulBoundToken.connect(secondAccount).safeMint(thirdAccount.address, "URI")).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe('Transfering of SBTs', () => {
        it('The issuer cannot transfer sbt', async () => {
            const { soulBoundToken, owner, secondAccount, thirdAccount } = await loadFixture(deployOneYearLockFixture);
                                
            await soulBoundToken.safeMint(secondAccount.address, "URI");
            expect(await soulBoundToken.balanceOf(secondAccount.address)).to.equal(1);

            const tokenId = 0;
            await soulBoundToken.connect(secondAccount).approve(owner.address, tokenId);

            await expect(soulBoundToken.transferFrom(secondAccount.address, thirdAccount.address, tokenId)).to.be.revertedWith('No tokens can be transferred');
        });

        it('The owner of a sbt cannot transfer its token', async () => {
            const { soulBoundToken, owner, secondAccount, thirdAccount } = await loadFixture(deployOneYearLockFixture);
                                
            await soulBoundToken.safeMint(secondAccount.address, "URI");
            expect(await soulBoundToken.balanceOf(secondAccount.address)).to.equal(1);

            const tokenId = 0;
            await expect(soulBoundToken.connect(secondAccount).transferFrom(secondAccount.address, thirdAccount.address, tokenId)).to.be.revertedWith('No tokens can be transferred');
        });
    });

    describe('Burning of SBTs', () => {
        it('Only the SBTs issuer can burn them', async () => {
            const { soulBoundToken, owner, secondAccount, thirdAccount } = await loadFixture(deployOneYearLockFixture);
                                
            await soulBoundToken.safeMint(secondAccount.address, "URI");
            expect(await soulBoundToken.balanceOf(secondAccount.address)).to.equal(1);

            const tokenId = 0;
            await soulBoundToken.safeBurn(tokenId);
            expect(await soulBoundToken.balanceOf(secondAccount.address)).to.equal(0);
        });

        it('The owner of an SBT cannot burn his own token', async () => {
            const { soulBoundToken, owner, secondAccount, thirdAccount } = await loadFixture(deployOneYearLockFixture);
                                
            await soulBoundToken.safeMint(secondAccount.address, "URI");
            expect(await soulBoundToken.balanceOf(secondAccount.address)).to.equal(1);

            const tokenId = 0;
            await expect(soulBoundToken.connect(secondAccount).safeBurn(tokenId)).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });
});