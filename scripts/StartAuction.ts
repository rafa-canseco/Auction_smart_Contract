import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Auction__factory } from "../typechain-types";
dotenv.config();

function setUpProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

async function main() {
    const provider = setUpProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

    let contractAddress = "0x290070165879B437C34eD55EDb9ca37FcefFd80E";
    let contractNFT = "0x3C089B290E75adB9BFB75748BEB7513c8e8dF788"
    let tokenId = 1;

    // Crear una instancia del contrato
    const contractInstance = Auction__factory.connect(contractAddress, wallet);

    // Establecer el tiempo de inicio (por ejemplo, en 1 hora)
    const oneHourInSeconds = 36;
    const startTime = (await provider.getBlock("latest")).timestamp + oneHourInSeconds;
    await contractInstance.setStartAuctionTime(startTime);

    // Establecer el tiempo de finalización (por ejemplo, en 24 horas)
    const twentyFourHoursInSeconds = 86;
    const stopTime = startTime + twentyFourHoursInSeconds;
    await contractInstance.setStopAuctionTime(stopTime);

    // Establecer y transferir el artículo de la subasta
    // await contractInstance.setAndTransferAuctionItem(contractNFT, tokenId);

    // Iniciar la subasta
    await contractInstance.startAuction();
    console.log("Auction started!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
