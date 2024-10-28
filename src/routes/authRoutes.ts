import {container} from "tsyringe";
import {Router} from "express";
import {AuthController} from "../controllers/authController";
import {authMiddleWare, verifyTokenAndRolesMiddleWare} from "../middlewares/authMiddleWare";
import {UserRole} from "../utils/userRole";


const authController = container.resolve(AuthController);
const authRoutes: Router = Router();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login to get a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: "admin@gmail.com"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "Test@123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully authenticated and returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID
 *                     email:
 *                       type: string
 *                       description: User's email address
 *                     name:
 *                       type: string
 *                       description: User's name
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/login", authController.login)
/**
 * @swagger
 * /auth/get-user:
 *   get:
 *     summary: Retrieve the authenticated user's information
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: User fetch successfully
 *       403:
 *         description: Token required
 *       404:
 *         description: User not found
 *       401:
 *         description: Wrong authentication token
 */
authRoutes.get("/get-user", authMiddleWare, authController.getUser)
authRoutes.post("/signup/space-creator", authController.spaceCreatorSignup)

export default authRoutes