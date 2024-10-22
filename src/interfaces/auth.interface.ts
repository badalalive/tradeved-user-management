// interfaces/request.interface.ts
import { Request } from "express";
import { IUser } from "./users.interface"; // Adjust the path as necessary

export interface DataStoredInToken {
    id: string;
}

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface RequestWithUser extends Request {
    user?: any;
}