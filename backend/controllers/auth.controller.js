import { pool } from "../src/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { BadRequestError, UnauthenticatedError, ConflictError } from "../errors/index.js"

export const register = async (req, res) => {
    const { username, password } = req.body
    if ( !username || !password) {
        throw new BadRequestError("Please provide username and password")
    }

    const { rows: existing } = await pool.query(
        "SELECT 1 FROM users WHERE username = $1",
        [username]
    )
    if (existing.length > 0) {
        throw new ConflictError("Username already exists")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const { rows } = await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
        [username, hashedPassword]
    )
    const user = rows[0]

    const token = jwt.sign(
        {
            id: user.id, // whichever exists
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    )

    // 🔹 Respond
    res.status(201).json({
        msg: "Register successful",
        user: {
            id: user.id,
            username: user.username,
        },
        token,
    })
}

export const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        throw new BadRequestError("Please provide username and password")
    }

    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
        username,
    ])
    if (rows.length === 0) throw new UnauthenticatedError("Invalid credentials")

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new UnauthenticatedError("Invalid credentials")

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    )

    // 🔹 Respond
    res.status(200).json({
        msg: "Login successful",
        user: {
            id: user.id,
            username: user.username,
            calorie_goal: user.calorie_goal,
            protein_goal_pct: user.protein_goal_pct,
            carbs_goal_pct: user.carbs_goal_pct,
            fat_goal_pct: user.fat_goal_pct
        },
        token,
    })
}