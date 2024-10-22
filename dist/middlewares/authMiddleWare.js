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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleWare = exports.verifyTokenAndRolesMiddleWare = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const httpException_1 = require("../exceptions/httpException");
const prisma = new client_1.PrismaClient();
const secret = String(process.env.JWT_SECRET);
const getAuthorization = (req) => {
    const cookie = req.cookies ? req.cookies["Authorization"] : null;
    if (cookie)
        return cookie;
    const header = req.header("Authorization");
    if (header)
        return header.split("Bearer ")[1];
    return null;
};
const verifyTokenAndRolesMiddleWare = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = getAuthorization(req);
        if (!token) {
            return next(new httpException_1.HttpException(403, 'Token required.'));
        }
        try {
            if (!secret) {
                throw new httpException_1.HttpException(500, "JWT secret key is not defined");
            }
            const decodedToken = (0, jsonwebtoken_1.verify)(token, secret);
            // Fetch user along with their roles
            const user = yield prisma.user.findUnique({
                where: { id: (decodedToken.id)
                },
                include: {
                    userRole: {
                        include: { role: true }
                    }
                }
            });
            if (user) {
                // Check if the user has one of the allowed roles
                const userRoles = user.userRole.map((userRole) => userRole.role.title);
                const hasRole = userRoles.some((role) => allowedRoles.includes(role));
                if (!hasRole) {
                    return next(new httpException_1.HttpException(403, 'Access denied.'));
                }
                req.user = user;
                next();
            }
            else {
                next(new httpException_1.HttpException(401, "Wrong authentication token"));
            }
        }
        catch (err) {
            return next(new httpException_1.HttpException(401, 'Wrong authentication token'));
        }
    });
};
exports.verifyTokenAndRolesMiddleWare = verifyTokenAndRolesMiddleWare;
const authMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = getAuthorization(req);
        if (token) {
            if (!secret) {
                throw new httpException_1.HttpException(500, "JWT secret key is not defined");
            }
            const decodedToken = (0, jsonwebtoken_1.verify)(token, secret);
            const user = yield prisma.user.findUnique({
                where: { id: (decodedToken.id)
                },
                include: {
                    userRole: {
                        include: { role: true }
                    }
                }
            });
            if (user) {
                req.user = user;
                next();
            }
            else {
                next(new httpException_1.HttpException(401, "Wrong authentication token"));
            }
        }
        else {
            next(new httpException_1.HttpException(404, "Authentication token missing"));
        }
    }
    catch (error) {
        next(new httpException_1.HttpException(401, "Wrong authentication token"));
    }
});
exports.authMiddleWare = authMiddleWare;
