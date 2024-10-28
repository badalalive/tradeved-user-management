"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = decryptData;
const crypto_1 = __importDefault(require("crypto"));
const privateKey = {
    key: ((_a = process.env.RSA_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')) || '',
    passphrase: process.env.RSA_PASSPHRASE || ''
};
function decryptData(encryptedData) {
    const decryptedData = crypto_1.default.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));
    return decryptedData.toString();
}
