"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = exports.getBcryptPassword = exports.generateRandomPassword = exports.sendEmail = exports.generateRandomToken = void 0;
exports.generateToken = generateToken;
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateRandomToken = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }
    return token;
};
exports.generateRandomToken = generateRandomToken;
const sendEmail = (email, subject, emailContent) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.SENDER, // email address
            pass: process.env.PASS, // email password or app-specific password
        },
    });
    try {
        yield transporter.sendMail({
            from: process.env.SENDER,
            to: email,
            subject: subject,
            html: emailContent, // Use 'html' instead of 'text' for formatting
        });
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
});
exports.sendEmail = sendEmail;
const generateRandomPassword = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const getRandomCharacter = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let password = "";
    // Ensure at least one uppercase letter
    password += getRandomCharacter("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    // Ensure at least one lowercase letter
    password += getRandomCharacter("abcdefghijklmnopqrstuvwxyz");
    // Ensure at least one number
    password += getRandomCharacter("0123456789");
    // Ensure at least one special character
    password += getRandomCharacter("!@#$%^&*()");
    // Generate the remaining characters randomly
    for (let i = 4; i < 8; i++) {
        password += getRandomCharacter(characters);
    }
    // Shuffle the password to randomize the order
    password = password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
    return password;
};
exports.generateRandomPassword = generateRandomPassword;
const getBcryptPassword = () => __awaiter(void 0, void 0, void 0, function* () {
    const password = (0, exports.generateRandomPassword)();
    return { password, bcrypt_password: yield bcrypt_1.default.hash(password, 10) };
});
exports.getBcryptPassword = getBcryptPassword;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10; // You can adjust the salt rounds as needed
    return yield bcrypt_1.default.hash(password, saltRounds);
});
exports.hashPassword = hashPassword;
// Function to verify a password
const verifyPassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hashedPassword);
});
exports.verifyPassword = verifyPassword;
// Function to generate the JWT token
function generateToken(userId) {
    const expiresIn = 60 * 60; // Token expires in 1 hour
    // Data stored in token
    const dataStoredInToken = {
        id: userId
    };
    // Generate and sign the token
    return { token: jsonwebtoken_1.default.sign(dataStoredInToken, String(process.env.JWT_SECRET), { expiresIn }), expiresIn: expiresIn };
}
