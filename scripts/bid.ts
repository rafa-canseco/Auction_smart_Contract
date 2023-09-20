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

    // Define el valor de tu oferta. Por ejemplo, para una oferta de 1 ether:
    const bidValue = ethers.parseEther("0.03"); 

    // Hacer una oferta en la subasta
    const bidTx = await contractInstance.bid({ value: bidValue });
    await bidTx.wait();

    console.log("Bid placed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
