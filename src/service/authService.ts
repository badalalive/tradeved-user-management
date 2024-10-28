import {inject, injectable} from "tsyringe";
import {AuthRepository} from "../repository/authRepository";
import {LoginDTO} from "../dto/loginDTO";
import {IUser} from "../interfaces/users.interface";
import {HttpException} from "../exceptions/httpException";
import bcrypt from "bcrypt";
import {UserRegisterStatus} from "@prisma/client";
import {generateToken, verifyPassword} from "../utils/utilities";
import {UserRole} from "../utils/userRole";
import {decryptData} from "../config/rsaDecryption";

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

    spaceCreatorSignup = async (data: string) => {
        const signUpBody = JSON.parse(decryptData(data));
        const role = await this.authRepository.getRoleByTitle(UserRole.SPACE_CREATOR);
        if(!role) {
            throw new HttpException(500, "Something went wrong")
        }
        const user = await this.authRepository.signUp(
            signUpBody.email,
            signUpBody.password,
            "",
            UserRegisterStatus.ACTIVE,
            "",
            role.id
        )
        return {
            data: user,
            statusCode: 201,
            message: "Space Creator Register"
        }
    }

    checkEmailExist = async (data: string) => {
        const email = decryptData(data);
        const user = await this.authRepository.findByEmail(email);
        if(user) {
            return {
                data: true,
                statusCode: 200,
                message: "Found"
            }
        } else {
            return {
                data: false,
                statusCode: 404,
                message: "Not Found"
            }
        }
    }
}