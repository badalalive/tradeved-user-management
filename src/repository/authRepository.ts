import {inject, injectable} from "tsyringe";
import {IUser} from "../interfaces/users.interface";
import {PrismaClient, Role, User, UserRegisterStatus} from "@prisma/client";

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

    async signUp(email: string, password: string, name: string, registration_status: UserRegisterStatus, created_by: string, roleId: string): Promise<IUser | null> {
        await this.prismaClient.$connect();
        const user = await this.prismaClient.user.create({
            data: {
                name,
                email,
                password,
                registration_status,
                created_by: created_by,
                updated_by: created_by,
                userRole: {
                    create: {
                        roleId: roleId,
                    }
                }
            }, include: {
                userRole: {
                    include: {
                        role: {
                           select: {
                               title: true
                           }
                        }
                    }
                }
            }
        })
        await this.prismaClient.$disconnect();
        return user;
    }

    async getRoleByTitle(title: string): Promise<Role | null> {
        await this.prismaClient.$connect();
        const role = await this.prismaClient.role.findUnique({
            where: {
                title
            }
        })
        await this.prismaClient.$disconnect();
        return role;
    }
}