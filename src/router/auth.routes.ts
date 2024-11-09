import express from 'express'
import AuthController from '../controller/AuthController'
import ValidateRequest from '../middleware/ValidateRequest'

const authRouter = express.Router()

/**
 * Auth routes
 */
authRouter.post(
    '/api/v1/auth/login',
    ValidateRequest.login,
    AuthController.userLogin,
    authRouter
)

export { authRouter }
