import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Auction__factory } from "../typechain-types"; // Asegúrate de ajustar la importación según tu estructura.
dotenv.config();

function setUpProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

async function main() {
    const provider = setUpProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

    let contractAddress = "0x290070165879B437C34eD55EDb9ca37FcefFd80E";

    // Crear una instancia del contrato
    const contractInstance = Auction__factory.connect(contractAddress, wallet);


      // Obtener el tiempo de inicio
      const auctionId = await contractInstance.getNftId();
      console.log("Auction ID:", auctionId.toString());

    // Obtener el tiempo de inicio
    const startTime = await contractInstance.getStartTime();
    console.log("Start time:", startTime.toString());

    // Obtener el tiempo de parada
    const stopTime = await contractInstance.getStopTime();
    console.log("Stop time:", stopTime.toString());

    const currentBid = await contractInstance.getCurrentBid();
    console.log("current bid",currentBid);
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
