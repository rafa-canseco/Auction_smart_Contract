import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { SimpleERC721__factory } from "../typechain-types";
dotenv.config();

const MINT_VALUE = ethers.parseUnits("5");

function setUpProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

async function main() {
    const provider = setUpProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    console.log("Minting NFT");

    let contractAddress = "0x9E78C2453CA42856ca88215a0D30d19F45107715";
    
    // Crear una instancia del contrato
    const contractInstance = SimpleERC721__factory.connect(contractAddress, wallet);

    const mintTx = await contractInstance.mint();
    await mintTx.wait();
    console.log("NFT minted");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
