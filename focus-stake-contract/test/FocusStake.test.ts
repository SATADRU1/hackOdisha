import { expect } from "chai";
import { ethers } from "hardhat";

describe("FocusStake Contract", function () {
    let FocusStake: any;
    let focusStake: any;
    let owner: any;
    let addr1: any;
    let addr2: any;

    beforeEach(async function () {
        FocusStake = await ethers.getContractFactory("FocusStake");
        [owner, addr1, addr2] = await ethers.getSigners();
        focusStake = await FocusStake.deploy();
        await focusStake.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await focusStake.owner()).to.equal(owner.address);
        });

        it("Should initialize with zero staked amount", async function () {
            expect(await focusStake.totalStaked()).to.equal(0);
        });
    });

    describe("Transactions", function () {
        it("Should allow users to stake tokens", async function () {
            await focusStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
            expect(await focusStake.totalStaked()).to.equal(ethers.utils.parseEther("1"));
        });

        it("Should allow users to withdraw staked tokens", async function () {
            await focusStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
            await focusStake.connect(addr1).withdraw(ethers.utils.parseEther("1"));
            expect(await focusStake.totalStaked()).to.equal(0);
        });

        it("Should emit Stake and Withdraw events", async function () {
            await expect(focusStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") }))
                .to.emit(focusStake, "Stake")
                .withArgs(addr1.address, ethers.utils.parseEther("1"));

            await focusStake.connect(addr1).stake({ value: ethers.utils.parseEther("1") });
            await expect(focusStake.connect(addr1).withdraw(ethers.utils.parseEther("1")))
                .to.emit(focusStake, "Withdraw")
                .withArgs(addr1.address, ethers.utils.parseEther("1"));
        });
    });
});