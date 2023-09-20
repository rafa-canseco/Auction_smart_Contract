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
    console.log("Attempting to withdraw funds...");

    let contractAddress = "0x290070165879B437C34eD55EDb9ca37FcefFd80E";
    const amountToWithdraw = ethers.parseEther("0.03"); // Cambia esta cantidad según lo que quieras retirar.

    // Crear una instancia del contrato
    const contractInstance = Auction__factory.connect(contractAddress, wallet);

    // Llamar a withdraw
    const withdrawTx = await contractInstance.ownerWithdraw(amountToWithdraw);
    await withdrawTx.wait();
    console.log(`Successfully withdrew ${ethers.formatEther(amountToWithdraw)} ETH from the contract.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
