import {inject, injectable} from "tsyringe";
import {NextFunction, Request, Response} from "express"
import {LoginDTO} from "../dto/loginDTO";
import {AuthService} from "../service/authService";
import {RequestWithUser} from "../interfaces/auth.interface";

@injectable()
export class AuthController {

    constructor (
        @inject("AuthService")
        private authService: AuthService,
    ) {
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginDTO: LoginDTO = req.body;
            const {data, statusCode, message} = await this.authService.login(loginDTO);
            res.status(statusCode).send({data, message});
        } catch(error: any) {
            next(error)
        }
    }

    getUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            res.status(200).send({data: user, message: "user fetch successfully"});
        } catch(error: any) {
            next(error)
        }
    }

}