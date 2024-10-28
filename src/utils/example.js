const crypto = require('crypto');
require('dotenv').config();

const privateKey = {
    key: process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n'),
    passphrase: process.env.RSA_PASSPHRASE
};
const publicKey = process.env.RSA_PUBLIC_KEY.replace(/\\n/g, '\n');

console.log(publicKey);
console.log(privateKey);
const data = {
    email: "badal@gmail.com",
    password: "badal123",
};

const dataString = JSON.stringify(data);
// Encrypt with the public key
const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(dataString));
console.log('Encrypted:', encryptedData.toString('base64'));

try {
    // Decrypt with the private key
    const decryptedData = crypto.privateDecrypt(privateKey, encryptedData);
    console.log('Decrypted:', JSON.parse(decryptedData.toString()));
} catch(error) {
    console.log("error", error.message())
}
