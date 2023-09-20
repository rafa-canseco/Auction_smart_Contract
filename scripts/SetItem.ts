import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Auction__factory,SimpleERC721__factory } from "../typechain-types";
dotenv.config();


function setUpProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

async function main() {
    const provider = setUpProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    console.log("NFT settling");
    let contractAddress = "0x290070165879B437C34eD55EDb9ca37FcefFd80E";
    let contractNFT = "0x3C089B290E75adB9BFB75748BEB7513c8e8dF788"
    let id = 1

    // Crear una instancia del contrato NFT (ERC721)
    const nftContractInstance = SimpleERC721__factory.connect(contractNFT, wallet);

    // Aprobar al contrato de subasta para transferir el NFT en tu nombre
    await nftContractInstance.approve(contractAddress, id);
    console.log("Approval granted to auction contract.");
    
    // Crear una instancia del contrato
    const contractInstance = Auction__factory.connect(contractAddress, wallet);

    const mintTx = await contractInstance.setAndTransferAuctionItem(contractNFT,id);
    await mintTx.wait();
    console.log("NFT settled");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
