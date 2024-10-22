import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import {DataStoredInToken, TokenData} from "../interfaces/auth.interface";
import jwt from "jsonwebtoken";

export const generateRandomToken = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }
    return token;
}

export const sendEmail = async (email: string, subject: string, emailContent: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.SENDER, // email address
            pass: process.env.PASS,   // email password or app-specific password
        },
    });


    try {
        await transporter.sendMail({
            from: process.env.SENDER,
            to: email,
            subject: subject,
            html: emailContent,  // Use 'html' instead of 'text' for formatting
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

export const generateRandomPassword = () => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const getRandomCharacter = (arr: any) =>
        arr[Math.floor(Math.random() * arr.length)];

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
export const getBcryptPassword = async () => {
    const password = generateRandomPassword();
    return { password, bcrypt_password: await bcrypt.hash(password, 10) };
};
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10; // You can adjust the salt rounds as needed
    return await bcrypt.hash(password, saltRounds);
};
// Function to verify a password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

// Function to generate the JWT token
export function generateToken(userId: string): TokenData {
    const expiresIn = 60 * 60;  // Token expires in 1 hour

    // Data stored in token
    const dataStoredInToken: DataStoredInToken = {
        id: userId
    };

    // Generate and sign the token
    return { token: jwt.sign(dataStoredInToken, String(process.env.JWT_SECRET), {expiresIn}), expiresIn: expiresIn };
}