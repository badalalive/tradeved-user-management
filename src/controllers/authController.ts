import {inject, injectable} from "tsyringe";
import {NextFunction, Request, Response} from "express"
import {LoginDTO} from "../dto/loginDTO";
import {AuthService} from "../service/authService";
import {RequestWithUser} from "../interfaces/auth.interface";
import {HttpException} from "../exceptions/httpException";

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
    checkEmail = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const dataObject: string = req.body.data;
            if (!dataObject) {
                new HttpException(400, "data should be given");
            }
            const {data, statusCode, message} = await this.authService.checkEmailExist(dataObject);
            res.status(statusCode).send({data, message});
        } catch(error: any) {
            next(error)
        }
    }

    spaceCreatorSignup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataObject: string = req.body.data;
            if (!dataObject) {
                new HttpException(400, "data should be given");
            }
            const {data, statusCode, message} = await this.authService.spaceCreatorSignup(dataObject);
            res.status(statusCode).send({data, message});
        } catch(error: any) {
            next(error)
        }
    }

}