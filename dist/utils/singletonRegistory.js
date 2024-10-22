"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const tsyringe_1 = require("tsyringe");
const authRepository_1 = require("../repository/authRepository");
const client_1 = require("@prisma/client");
const authController_1 = require("../controllers/authController");
const authService_1 = require("../service/authService");
exports.prisma = new client_1.PrismaClient({
    errorFormat: "minimal",
});
tsyringe_1.container.register("PrismaClient", {
    useValue: exports.prisma,
});
// controllers
tsyringe_1.container.registerSingleton("AuthController", authController_1.AuthController);
// services
tsyringe_1.container.registerSingleton("AuthService", authService_1.AuthService);
// repositories
tsyringe_1.container.registerSingleton("AuthRepository", authRepository_1.AuthRepository);
