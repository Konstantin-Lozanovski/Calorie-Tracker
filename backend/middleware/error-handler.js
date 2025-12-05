import { StatusCodes } from "http-status-codes"
import { CustomAPIError } from "../errors/index.js"

const errorHandlerMiddleware = (err, req, res, _next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  // 2. Setup Default Error
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  }

  // 3. Postgres Unique Violation (e.g. Duplicate Username)
  // Postgres uses string codes. '23505' is unique_violation
  if (err.code === '23505') {
    customError.msg = `Duplicate value entered for ${err.constraint || 'field'}, please choose another value`
    customError.statusCode = 400
  }

  // 4. Postgres Foreign Key Violation (Invalid user_id)
  if (err.code === '23503') {
      customError.msg = `Invalid reference to another resource`
      customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware
