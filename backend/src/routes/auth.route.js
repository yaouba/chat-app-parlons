/** Auth Routes */

import { Router } from "express";

import { login, logout, register, updateProfile } from "../controllers/auth.controllers.js";
import { validateRegistionInput } from "../middlewares/validateRegistionInput.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', validateRegistionInput, register)

router.post('/login', login)

router.post('/logout', logout)

router.post('/update-profile', protectRoute, updateProfile)

export default router;