import {inject, injectable} from "tsyringe";
import {AuthRepository} from "../repository/authRepository";
import {LoginDTO} from "../dto/loginDTO";
import {IUser} from "../interfaces/users.interface";
import {HttpException} from "../exceptions/httpException";
import bcrypt from "bcrypt";
import {UserRegisterStatus} from "@prisma/client";
import {generateToken, verifyPassword} from "../utils/utilities";

@injectable()
export class AuthService {
    constructor (
        @inject("AuthRepository")
        private authRepository: AuthRepository,
    ) {}

    login = async (loginDTO: LoginDTO) => {
        const user = await this.authRepository.findByEmail(loginDTO.email);
        if(!user || !user.password || user.registration_status !== UserRegisterStatus.ACTIVE) {
            throw new HttpException(404, "Invalid Email");
        }
        if(!await verifyPassword(loginDTO.password, user.password)) {
            throw new HttpException(401, "Invalid Credentials");
        }
        // delete password
        user.password = null;
        return { data: generateToken(user.id), message: "login Successfully", statusCode: 200}

    }
}