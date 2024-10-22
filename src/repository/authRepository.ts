import {inject, injectable} from "tsyringe";
import {IUser} from "../interfaces/users.interface";
import {PrismaClient, User} from "@prisma/client";

@injectable()
export class AuthRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {
    }
    async findByEmail(email: string): Promise<IUser | null> {
        await this.prismaClient.$connect();
        const user = await this.prismaClient.user.findUnique({
            where: {
                email: email
            }, include: {
                userRole: {
                    include: {
                        role: true
                    }
                }
            }
        })
        await this.prismaClient.$disconnect();
        return user;
    }
}