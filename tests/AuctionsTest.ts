import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Auction } from "../typechain-types";
import { SimpleERC721 } from "../typechain-types";
import { parseEther } from "ethers";

describe("Auction", async () => {
  let auctionContract_: Auction;
  let erc721Contract: SimpleERC721;
  let deployer: HardhatEthersSigner;
  let acct1: HardhatEthersSigner;
  let acct2: HardhatEthersSigner;

  async function deployContract() {
    const auctionFactory = await ethers.getContractFactory("Auction");
    const auctionContract = await auctionFactory.deploy();
    await auctionContract.waitForDeployment();

    const erc721Factory = await ethers.getContractFactory("SimpleERC721");
    const erc721 = await erc721Factory.deploy();
    await erc721.waitForDeployment();

    return { auctionContract, erc721 };
  }

  beforeEach(async () => {
    [deployer, acct1, acct2] = await ethers.getSigners();
    const { auctionContract, erc721 } = await loadFixture(deployContract);

    auctionContract_ = auctionContract;
    erc721Contract = erc721;
  });

  describe("when the contract is deployed", async () => {
    it("the owner is set to the msg.sender", async () => {
      const owner = await auctionContract_.getOwner();
      expect(owner).to.be.eq(deployer.address);
    });

    // Nuevo test para comprobar que los contratos han sido desplegados y mostrar sus direcciones
    it("should verify the contracts are deployed and log their addresses", async () => {
      expect(auctionContract_.address).to.exist;
      expect(erc721Contract.address).to.exist;

      console.log("Auction Contract Address:", auctionContract_.address);
      console.log("SimpleERC721 Contract Address:", erc721Contract.address);
    });
  });
});


  describe("when setting auction conditions", async () => {
    it("allows only the owner to set the start and stop times", async () => {
      const startTime = Math.floor(Date.now() / 1000) + 10;  // 10 seconds from now
      const stopTime = startTime + 100;  // 100 seconds later
      
      await expect(auctionContract_.connect(acct1).setStartAuctionTime(startTime)).to.be.revertedWith("not the owner");
      await expect(auctionContract_.connect(acct1).setStopAuctionTime(stopTime)).to.be.revertedWith("not the owner");
      
      await auctionContract_.setStartAuctionTime(startTime);
      await auctionContract_.setStopAuctionTime(stopTime);
      
      expect(await auctionContract_.getStartTime()).to.equal(startTime);
      expect(await auctionContract_.getStopTime()).to.equal(stopTime);
    });
  });



//   // BIDDING
//   describe("bidding in the auction", async () => {
//     beforeEach(async () => {
//       // Setting a dummy auction item and time for the sake of bidding tests.
//       await auctionContract_.setAuctionItem(erc721Contract.address, tokenId);
//       const startTime = Math.floor(Date.now() / 1000) + 10;
//       await auctionContract_.setStartAuctionTime(startTime);
//       await auctionContract_.startAuction();
//     });
// });

//     it("allows users to place bids", async () => {
//       await expect(auctionContract_.connect(acct1).bid({ value: parseEther("1") }))
//         .to.emit(auctionContract_, "BidPlaced").withArgs(parseEther("1"));
//     });

//     it("doesn't allow bids lower than the current highest bid", async () => {
//       await auctionContract_.connect(acct1).bid({ value: parseEther("1") });
//       await expect(auctionContract_.connect(acct2).bid({ value: parseEther("0.5") }))
//         .to.be.revertedWith("Bid not high enough");
//     });

//     it("refunds the previous highest bidder", async () => {
//       await auctionContract_.connect(acct1).bid({ value: parseEther("1") });
//       const initialBalance = await acct1.getBalance();
//       await auctionContract_.connect(acct2).bid({ value: parseEther("2") });
//       const finalBalance = await acct1.getBalance();
//       expect(finalBalance).to.be.gt(initialBalance);
//     });
//   });

//   // ENDING AUCTION
//   describe("ending the auction", async () => {
//     beforeEach(async () => {
//       // Setting a dummy auction item and time.
//       await auctionContract_.setAuctionItem(erc721Address, tokenId);
//       const startTime = Math.floor(Date.now() / 1000) + 10;
//       await auctionContract_.setStartAuctionTime(startTime);
//       await auctionContract_.startAuction();
//     });

//     it("only the owner can end the auction", async () => {
//       await expect(auctionContract_.connect(acct1).stopAuction()).to.be.revertedWith("not the owner");
//     });

//     it("auction can only be ended after the stop time", async () => {
//       // Here, we're not really waiting until the stop time. Instead, we're just checking the contract logic.
//       await expect(auctionContract_.stopAuction()).to.be.revertedWith("auction is still live");
//     });

//     // Add more cases like checking the winner and if the ERC721 was transferred correctly.
//   });

//   // WITHDRAWAL
//   describe("withdrawal from the contract", async () => {
//     beforeEach(async () => {
//       // Assumed that the auction ended, and there's ether to withdraw.
//     });

//     it("only the owner can withdraw", async () => {
//       await expect(auctionContract_.connect(acct1).withdraw(parseEther("1")))
//         .to.be.revertedWith("not the owner");
//     });

//     // More withdrawal test cases go here.
//   });
// });

// }