import { pool } from "../src/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { BadRequestError, UnauthenticatedError, ConflictError } from "../errors/index.js"

export const register = async (req, res) => {
    let { username, password, email } = req.body
    if ( !username || !password || !email) {
        throw new BadRequestError("Please provide username, email and password")
    }

    username = username.trim();
    email = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new BadRequestError("Please provide a valid email");
    }


    const { rows: existing } = await pool.query(
        "SELECT username, email FROM users WHERE username = $1 OR email = $2",
        [username, email]
    );

    if (existing.length > 0) {
        throw new ConflictError("Account already exists");
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const { rows } = await pool.query(
        `INSERT INTO users (username, email, password) 
        VALUES ($1, $2, $3) 
        RETURNING id, username, email, calorie_goal, protein_goal_pct, carbs_goal_pct, fat_goal_pct, weight_goal`,
        [username, email, hashedPassword]
    )
    const user = rows[0]

    const token = jwt.sign(
        {
            id: user.id,
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
            email: user.email,
            calorie_goal: user.calorie_goal,
            protein_goal_pct: user.protein_goal_pct,
            carbs_goal_pct: user.carbs_goal_pct,
            fat_goal_pct: user.fat_goal_pct,
            weight_goal: user.weight_goal
        },
        token,
    })
}

export const login = async (req, res) => {
    let { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }

    email = email.trim().toLowerCase();

    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
    ])
    if (rows.length === 0) throw new UnauthenticatedError("Invalid credentials")

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new UnauthenticatedError("Invalid credentials")

    const token = jwt.sign(
        {
            id: user.id,
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
            email: user.email,
            calorie_goal: user.calorie_goal,
            protein_goal_pct: user.protein_goal_pct,
            carbs_goal_pct: user.carbs_goal_pct,
            fat_goal_pct: user.fat_goal_pct,
            weight_goal: user.weight_goal
        },
        token,
    })
}