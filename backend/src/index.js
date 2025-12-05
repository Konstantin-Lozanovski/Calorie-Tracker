import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { pool } from "./db.js"
import "express-async-errors"

// Routers (Singular file names)
import authRouter from "../routes/auth.routes.js"
import userRouter from "../routes/user.routes.js"
import dayRouter from "../routes/day.routes.js"   // changed from days
import mealRouter from "../routes/meal.routes.js" // changed from meals
import foodRouter from "../routes/food.routes.js" // changed from foods


//middleware
import notFoundMiddleware from "../middleware/not-found.js"
import errorHandlerMiddleware from "../middleware/error-handler.js"
import authenticateUser from "../middleware/authentication.js"

dotenv.config()

const app = express()

//routes
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)

app.use(authenticateUser)
app.use("/api/user", userRouter)
app.use("/api/days", dayRouter)
app.use("/api/meals", mealRouter)
app.use("/api/foods", foodRouter)

//
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 4000

const start = async () => {
  try {
    await pool.query("SELECT NOW()")
    app.listen(port, () => {console.log(`Server listening on port ${port}...`)})
  } catch (error) {
    console.log(error)
  }
}

start().catch((error) => {
    console.error("Failed to start application:", error)
    process.exit(1) // Exit with error code
})
