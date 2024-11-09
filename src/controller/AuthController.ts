import { NextFunction, Request, Response } from 'express'
import { collections } from '../server'
import { errorMessages, httpStatus, reqData } from '../tools/Constants'
import { BadRequest, NotFound } from '../tools/Error'
import { generateSession, getDataFromPreviousMiddleware } from '../tools/Helpers'
import Log from '../tools/Log'

export default class AuthController {
    /**
     * Checks if user exists and if password is correct. If both are true, it returns a JWT token.
     * 
     * @throws `BadRequest` If the credentials are invalid
     * @throws `NotFound` If the user is not found
     */
    public static readonly userLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)
            const password = getDataFromPreviousMiddleware(reqData.password, req, next)

            const user = await collections.people.users.findOne(filter, { projection: { _id: 1, password: 1 } })

            if (!user) {
                next(new NotFound())
                next()
            } else if (user.password !== password) {
                next(new BadRequest(errorMessages.loginFailed))
                next()
            } else {
                const session = generateSession(user._id.toString())
                await collections.auth.sessions.deleteMany({ user_id: user._id })
                await collections.auth.sessions.insertOne(session as object)

                res.status(httpStatus.ok).send({ token: session.token, expiresAt: session.expires_at })
            }
            Log.info('controller', 'UserController :: Calling Endpoint :: Login')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'UserController :: Calling Endpoint :: Login'
            next(error)
        }
    }
}
