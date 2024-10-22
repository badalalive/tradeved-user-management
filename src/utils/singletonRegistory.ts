import {container} from "tsyringe";
import {AuthRepository} from "../repository/authRepository";
import {PrismaClient} from "@prisma/client";
import {AuthController} from "../controllers/authController";
import {AuthService} from "../service/authService";

export const prisma: PrismaClient = new PrismaClient({
    errorFormat: "minimal",
});

container.register<PrismaClient>("PrismaClient", {
    useValue: prisma,
});

// controllers
container.registerSingleton<AuthController>("AuthController", AuthController);
// services
container.registerSingleton<AuthService>("AuthService", AuthService);
// repositories
container.registerSingleton<AuthRepository>("AuthRepository", AuthRepository);