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

    let contractAddress = "0xB1558b8F07BcBc9abA78029b5b40f54F98Ee97c6";

    // Crear una instancia del contrato
    const contractInstance = Auction__factory.connect(contractAddress, wallet);

    // Obtener el ganador de la subasta
    const [winnerAddress, winnerBidAmount] = await contractInstance.getWinner();

    console.log("Auction winner address:", winnerAddress);
    console.log("Winning bid amount:", ethers.formatEther(winnerBidAmount));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
