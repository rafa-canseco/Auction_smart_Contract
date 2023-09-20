import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { run } from "hardhat";
import { Auction__factory, SimpleERC721__factory } from "../typechain-types";
dotenv.config();

function setUpProvider() {
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  return provider;
}

async function main() {
  const provider = setUpProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  console.log("deploying Contract");

  const MyAuctionContractFactory = new Auction__factory(wallet);
  const MyAuctionContract = await MyAuctionContractFactory.deploy();
  const deploymentTransaction = MyAuctionContract.deploymentTransaction();
  await deploymentTransaction?.wait(5);
  await MyAuctionContract.waitForDeployment();
  console.log("contract deployed")
  const  MyAuctionContractAddress = await MyAuctionContract.getAddress()
  console.log("Waiting for 5 confirmations...");
  console.log("Transaction has been confirmed 5 times!");
  console.log("Contract Address:",MyAuctionContractAddress)

  await run("verify:verify", {
    address: MyAuctionContractAddress,
  });

  // const MyERC721ContractFactory = new SimpleERC721__factory(wallet);
  // const MyErc721Contract = await MyERC721ContractFactory.deploy();
  // await MyErc721Contract.waitForDeployment();
  // const MyErc721ContractAddress = await MyErc721Contract.getAddress();

  console.log("Auction Contract Address:", MyAuctionContractAddress);
  // console.log("ERC721 Contract Address:",MyErc721ContractAddress)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
