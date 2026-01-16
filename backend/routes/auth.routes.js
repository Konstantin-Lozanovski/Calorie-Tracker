import express from "express"
import { validate } from "../middleware/validation.js"
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = express.Router()

import { register, login } from "../controllers/auth.controller.js"

router.post("/register", validate(registerSchema, "body"), register)
router.post("/login", validate(loginSchema, "body"), login)

export default router
