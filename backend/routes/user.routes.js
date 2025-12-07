import express from "express"
import { getMe, updateGoals } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/me", getMe)
router.put("/goals", updateGoals)

export default router
