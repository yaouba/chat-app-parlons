/** Auth Routes */

import { Router } from "express";

import { login, logout, register } from "../controllers/auth.controllers.js";
import { validateRegistionInput } from "../middlewares/validateRegistionInput.js";

const router = Router();

router.post('/register', validateRegistionInput, register)

router.post('/login', login)

router.post('/logout', logout)

export default router;