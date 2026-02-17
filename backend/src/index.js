import express from "express"
import cors from "cors"
import { pool } from "./db.js"
import "express-async-errors"
import {PORT} from "./config/env.js"

// Routers
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import dayRouter from "./routes/day.routes.js"
import mealRouter from "./routes/meal.routes.js"
import foodRouter from "./routes/food.routes.js"


//Middleware
import notFoundMiddleware from "./middleware/not-found.js"
import errorHandlerMiddleware from "./middleware/error-handler.js"
import authenticateUser from "./middleware/authentication.js"


const app = express()

//Routes
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)

app.use("/api/user", authenticateUser, userRouter)
app.use("/api/days", authenticateUser, dayRouter)
app.use("/api/meals", authenticateUser, mealRouter)
app.use("/api/foods", authenticateUser, foodRouter)

//
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = PORT || 4000

const start = async () => {
  try {
    await pool.query("SELECT NOW()")
    app.listen(port, () => {console.log(`Server listening on portaaaa ${port}...`)})
  } catch (error) {
    console.log(error)
  }
}

start().catch((error) => {
    console.error("Failed to start application:", error)
    process.exit(1)
})
