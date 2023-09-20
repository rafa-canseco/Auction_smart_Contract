import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Auction__factory } from "../typechain-types"; // Ajusta la importación según tu estructura.
dotenv.config();

function setUpProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

async function main() {
    const provider = setUpProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    console.log("Fetching NFT for auction...");

    let contractAddress = "0x0D4564f2A019fC825050Bd104f6A16a846e16f6e";

    // Crear una instancia del contrato
    const contractInstance = Auction__factory.connect(contractAddress, wallet);

    // Llamar a getAuctionItem
    const nftAddress = await contractInstance.getAuctionItem();
    console.log("Auction NFT Address:", nftAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
