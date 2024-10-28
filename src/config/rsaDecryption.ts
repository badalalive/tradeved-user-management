import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const privateKey = {
    key: process.env.RSA_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    passphrase: process.env.RSA_PASSPHRASE || ''
};

export function decryptData(encryptedData: string): string {
    const decryptedData = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));
    return decryptedData.toString();
}