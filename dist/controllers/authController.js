"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AuthController = void 0;
const tsyringe_1 = require("tsyringe");
const authService_1 = require("../service/authService");
const httpException_1 = require("../exceptions/httpException");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const loginDTO = req.body;
                const { data, statusCode, message } = yield this.authService.login(loginDTO);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                res.status(200).send({ data: user, message: "user fetch successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.checkEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dataObject = req.body.data;
                if (!dataObject) {
                    new httpException_1.HttpException(400, "data should be given");
                }
                const { data, statusCode, message } = yield this.authService.checkEmailExist(dataObject);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.spaceCreatorSignup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dataObject = req.body.data;
                if (!dataObject) {
                    new httpException_1.HttpException(400, "data should be given");
                }
                const { data, statusCode, message } = yield this.authService.spaceCreatorSignup(dataObject);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("AuthService")),
    __metadata("design:paramtypes", [authService_1.AuthService])
], AuthController);
