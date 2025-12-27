import { getUser } from "../controllers/controller.user.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get authenticated user
 *     description: Returns the authenticated user data, including team and tasks, using JWT authentication via cookie.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "ckx123abc"
 *                 name:
 *                   type: string
 *                   example: "Example User"
 *                 email:
 *                   type: string
 *                   example: "example@email.com"
 *                 team:
 *                   type: object
 *                   nullable: true
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


router.get("/me", getUser);

export { router as userRouter };
