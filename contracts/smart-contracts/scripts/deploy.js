import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const FocusStakeFactory = await ethers.getContractFactory("FocusStake");
    const focusStakeContract = await FocusStakeFactory.deploy();

    console.log("FocusStake contract deployed to:", focusStakeContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });