import express from "express"
import { validate } from "../middleware/validation.js"
import {updateGoalsSchema} from "../schemas/user.schema.js";
import { getMe, updateGoals } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/me", getMe)
router.put("/goals", validate(updateGoalsSchema), updateGoals)

export default router
