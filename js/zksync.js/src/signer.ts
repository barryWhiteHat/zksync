import {
    privateKeyFromSeed,
    signTransactionBytes,
    privateKeyToPubKeyHash
} from "./crypto";
import {BigNumber, BigNumberish, ethers} from "ethers";
import {
    packAmountChecked,
    packFeeChecked,
    getEthSignatureType,
    signMessagePersonalAPI,
    getSignedBytesFromMessage
} from "./utils";
import BN = require("bn.js");
import {
    Address,
    EthSignerType,
    PubKeyHash,
    Transfer,
    Withdraw
} from "./types";

const MAX_NUMBER_OF_TOKENS = 128;
const MAX_NUMBER_OF_ACCOUNTS = Math.pow(2, 24);

export class Signer {
    readonly privateKey: Uint8Array;

    private constructor(privKey: Uint8Array) {
        this.privateKey = privKey;
    }

    pubKeyHash(): PubKeyHash {
        return privateKeyToPubKeyHash(this.privateKey);
    }

    signSyncTransfer(transfer: {
        accountId: number;
        from: Address;
        to: Address;
        tokenId: number;
        amount: BigNumberish;
        fee: BigNumberish;
        nonce: number;
    }): Transfer {
        const type = Buffer.from([5]); // tx type
        const accountId = serializeAccountId(transfer.accountId);
        const from = serializeAddress(transfer.from);
        const to = serializeAddress(transfer.to);
        const token = serializeTokenId(transfer.tokenId);
        const amount = serializeAmountPacked(transfer.amount);
        const fee = serializeFeePacked(transfer.fee);
        const nonce = serializeNonce(transfer.nonce);
        const msgBytes = Buffer.concat([
            type,
            accountId,
            from,
            to,
            token,
            amount,
            fee,
            nonce
        ]);

        const signature = signTransactionBytes(this.privateKey, msgBytes);

        return {
            type: "Transfer",
            accountId: transfer.accountId,
            from: transfer.from,
            to: transfer.to,
            token: transfer.tokenId,
            amount: BigNumber.from(transfer.amount).toString(),
            fee: BigNumber.from(transfer.fee).toString(),
            nonce: transfer.nonce,
            signature
        };
    }

    signSyncWithdraw(withdraw: {
        accountId: number;
        from: Address;
        ethAddress: string;
        tokenId: number;
        amount: BigNumberish;
        fee: BigNumberish;
        nonce: number;
    }): Withdraw {
        const typeBytes = Buffer.from([3]);
        const accountId = serializeAccountId(withdraw.accountId);
        const accountBytes = serializeAddress(withdraw.from);
        const ethAddressBytes = serializeAddress(withdraw.ethAddress);
        const tokenIdBytes = serializeTokenId(withdraw.tokenId);
        const amountBytes = serializeAmountFull(withdraw.amount);
        const feeBytes = serializeFeePacked(withdraw.fee);
        const nonceBytes = serializeNonce(withdraw.nonce);
        const msgBytes = Buffer.concat([
            typeBytes,
            accountId,
            accountBytes,
            ethAddressBytes,
            tokenIdBytes,
            amountBytes,
            feeBytes,
            nonceBytes
        ]);
        const signature = signTransactionBytes(this.privateKey, msgBytes);
        return {
            type: "Withdraw",
            accountId: withdraw.accountId,
            from: withdraw.from,
            to: withdraw.ethAddress,
            token: withdraw.tokenId,
            amount: BigNumber.from(withdraw.amount).toString(),
            fee: BigNumber.from(withdraw.fee).toString(),
            nonce: withdraw.nonce,
            signature
        };
    }

    static fromPrivateKey(pk: Uint8Array): Signer {
        return new Signer(pk);
    }

    static fromSeed(seed: Buffer): Signer {
        return new Signer(privateKeyFromSeed(seed));
    }

    static async fromETHSignature(
        ethSigner: ethers.Signer
    ): Promise<{
        signer: Signer;
        ethSignatureType: EthSignerType;
    }> {
        const message =
            "Access zkSync account.\n" +
            "\n" +
            "Only sign this message for a trusted client!";
        const signedBytes = getSignedBytesFromMessage(message, false);
        const signature = await signMessagePersonalAPI(ethSigner, signedBytes);
        const address = await ethSigner.getAddress();
        const ethSignatureType = await getEthSignatureType(
            ethSigner.provider,
            message,
            signature,
            address
        );
        const seed = Buffer.from(signature.substr(2), "hex");
        const signer = Signer.fromSeed(seed);
        return { signer, ethSignatureType };
    }
}

function removeAddressPrefix(address: Address | PubKeyHash): string {
    if (address.startsWith("0x")) return address.substr(2);

    if (address.startsWith("sync:")) return address.substr(5);

    throw new Error(
        "ETH address must start with '0x' and PubKeyHash must start with 'sync:'"
    );
}

// PubKeyHash or eth address
export function serializeAddress(address: Address | PubKeyHash): Buffer {
    const prefixlessAddress = removeAddressPrefix(address);

    const addressBytes = Buffer.from(prefixlessAddress, "hex");
    if (addressBytes.length != 20) {
        throw new Error("Address must be 20 bytes long");
    }

    return addressBytes;
}

export function serializeAccountId(accountId: number): Buffer {
    if (accountId < 0) {
        throw new Error("Negative account id");
    }
    if (accountId >= MAX_NUMBER_OF_ACCOUNTS) {
        throw new Error("AccountId is too big");
    }
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32BE(accountId, 0);
    return buffer;
}

export function serializeTokenId(tokenId: number): Buffer {
    if (tokenId < 0) {
        throw new Error("Negative tokenId");
    }
    if (tokenId >= MAX_NUMBER_OF_TOKENS) {
        throw new Error("TokenId is too big");
    }
    const buffer = Buffer.alloc(2);
    buffer.writeUInt16BE(tokenId, 0);
    return buffer;
}

export function serializeAmountPacked(amount: BigNumberish): Buffer {
    const bnAmount = new BN(BigNumber.from(amount).toString());
    return packAmountChecked(bnAmount);
}

export function serializeAmountFull(amount: BigNumberish): Buffer {
    const bnAmount = new BN(BigNumber.from(amount).toString());
    return bnAmount.toArrayLike(Buffer, "be", 16);
}

export function serializeFeePacked(fee: BigNumberish): Buffer {
    const bnFee = new BN(BigNumber.from(fee).toString());
    return packFeeChecked(bnFee);
}

export function serializeNonce(nonce: number): Buffer {
    if (nonce < 0) {
        throw new Error("Negative nonce");
    }
    const buff = Buffer.alloc(4);
    buff.writeUInt32BE(nonce, 0);
    return buff;
}
