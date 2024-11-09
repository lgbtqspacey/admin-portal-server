import express from 'express'
import AuthController from '../controller/AuthController'
import Auth from '../middleware/Auth'
import ValidateRequest from '../middleware/ValidateRequest'

const authRouter = express.Router()

/**
 * Auth routes
 */
authRouter.post(
    '/api/v1/auth/login',
    ValidateRequest.login,
    AuthController.login,
    authRouter
)

authRouter.post(
    '/api/v1/auth/logout',
    Auth.session,
    ValidateRequest.logout,
    AuthController.logout,
    authRouter
)

authRouter.post(
    '/api/v1/auth/logout/:id',
    Auth.session,
    ValidateRequest.id,
    AuthController.logoutAllDevices,
    authRouter
)

export { authRouter }
