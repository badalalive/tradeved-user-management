import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/httpException"; // Custom exception

export const errorHandler = (
    err: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack); // Log the error for debugging

    // Default to 500 if no status is found
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        error: message,
    });
};
