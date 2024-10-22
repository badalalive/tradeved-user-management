import { Request, Response, NextFunction } from 'express';
import jwt, {verify} from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import {HttpException} from "../exceptions/httpException";
import {DataStoredInToken, RequestWithUser} from "../interfaces/auth.interface";

const prisma = new PrismaClient();
const secret = String(process.env.JWT_SECRET);

const getAuthorization = (req: RequestWithUser): string | null => {
    const cookie = req.cookies ? req.cookies["Authorization"] : null;
    if (cookie) return cookie;

    const header = req.header("Authorization");
    if (header) return header.split("Bearer ")[1];

    return null;
};

export const verifyTokenAndRolesMiddleWare = (allowedRoles: string[]) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const token = getAuthorization(req);

        if (!token) {
            return next(new HttpException(403, 'Token required.'));
        }

        try {
            if (!secret) {
                throw new HttpException(500, "JWT secret key is not defined");
            }
            const decodedToken = verify(token, secret) as DataStoredInToken;

            // Fetch user along with their roles
            const user: any = await prisma.user.findUnique({
                where: { id: (decodedToken.id)
                },
                include: {
                    userRole: {
                        include: { role: true}
                    }
                }
            });
            if (user) {
                // Check if the user has one of the allowed roles
                const userRoles = user.userRole.map((userRole: any) => userRole.role.title);
                const hasRole = userRoles.some((role: string) => allowedRoles.includes(role));

                if (!hasRole) {
                    return next(new HttpException(403, 'Access denied.'));
                }
                req.user = user;
                next();
            } else {
                next(new HttpException(401, "Wrong authentication token"));
            }
        } catch (err) {
            return next(new HttpException(401, 'Wrong authentication token'));
        }
    };
};
export const authMiddleWare = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = getAuthorization(req);

        if (token) {
            if (!secret) {
                throw new HttpException(500, "JWT secret key is not defined");
            }

            const decodedToken = verify(token, secret) as DataStoredInToken;
            const user = await prisma.user.findUnique({
                where: { id: (decodedToken.id)
                },
                include: {
                    userRole: {
                        include: { role: true}
                    }
                }
            });
            if (user) {
                req.user = user;
                next();
            } else {
                next(new HttpException(401, "Wrong authentication token"));
            }
        } else {
            next(new HttpException(404, "Authentication token missing"));
        }
    } catch (error) {
        next(new HttpException(401, "Wrong authentication token"));
    }
};