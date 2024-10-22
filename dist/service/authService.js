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
exports.AuthService = void 0;
const tsyringe_1 = require("tsyringe");
const authRepository_1 = require("../repository/authRepository");
const httpException_1 = require("../exceptions/httpException");
const client_1 = require("@prisma/client");
const utilities_1 = require("../utils/utilities");
let AuthService = class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
        this.login = (loginDTO) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.findByEmail(loginDTO.email);
            if (!user || !user.password || user.registration_status !== client_1.UserRegisterStatus.ACTIVE) {
                throw new httpException_1.HttpException(404, "Invalid Email");
            }
            if (!(yield (0, utilities_1.verifyPassword)(loginDTO.password, user.password))) {
                throw new httpException_1.HttpException(401, "Invalid Credentials");
            }
            // delete password
            user.password = null;
            return { data: (0, utilities_1.generateToken)(user.id), message: "login Successfully", statusCode: 200 };
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("AuthRepository")),
    __metadata("design:paramtypes", [authRepository_1.AuthRepository])
], AuthService);
