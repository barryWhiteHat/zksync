import {bigNumberify} from "ethers/utils";
import {Contract, ethers} from "ethers";
import {franklinContractCode} from "../src.ts/deploy";

const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_URL);
const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC, "m/44'/60'/0'/0/1").connect(provider);
const franklinDeployedContract = new Contract(process.env.CONTRACT_ADDR, franklinContractCode.interface, wallet);

async function main() {
    const blockProof = ["0x248e713ef673d819793fddf7af2eaee18cb0fef2698cfdafb5a1133d76a3d6ce", "0x3fb5d99e4f02be3ed3ce4fd10a71fb929669001f442774e713723faadfd4c37", "0x28a6a4230573eeefd3afe006872c2f6bbafadd7bf4dada5bac8f8dc81ab173f1", "0x3367fbbc14dc25a837cc43337f58ceae358f75f68630853167a86d77c0a6021", "0x1776d25389caf42351ba498d8004d3f7131a74f093c2172b54b6b5eb4bf157fc", "0x1cbb8012cb48807e0ac6ed29602ebed033142949fdda8bfc8f28062e4971eb84", "0x24f65e2ed6467dc7d83fdfa8b4bcf5bb93af111fc119860f56b07c10df42702", "0x2d0fd274a53293cab12986bc2997d7fd8eccb80f1d480fc5539bca2bcaa8e44a"];
    let tx = await franklinDeployedContract.verifyBlock(1, blockProof, {gasLimit: bigNumberify("1000000")});
    console.log("tx: ",tx);
    let receipt = await tx.wait();
    console.log("receipt :", receipt);
}

main();