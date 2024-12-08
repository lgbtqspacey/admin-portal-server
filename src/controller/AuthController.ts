import { NextFunction, Request, Response } from 'express'
import { collections } from '../server'
import { errorMessages, headers, httpStatus, reqData } from '../tools/Constants'
import { BadRequest, InternalServerError, NotFound } from '../tools/Error'
import { confirmSession, createSession, getDataFromPreviousMiddleware } from '../tools/Helpers'
import Log from '../tools/Log'
import { User } from '../types/Schemas'

export default class AuthController {
    public static readonly login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)
            const password = getDataFromPreviousMiddleware(reqData.password, req, next)
            const deviceInfo = getDataFromPreviousMiddleware(reqData.deviceInfo, req, next)

            const user = await collections.users.findOne(filter, { projection: { _id: 1, password: 1, accessLevel: 1 } })

            if (!user) {
                next(new NotFound())
                next()
            } else if (user.password !== password) {
                next(new BadRequest(errorMessages.loginFailed))
                next()
            } else {
                const session = createSession(user as unknown as User, deviceInfo)

                await collections.sessions.insertOne(session as object)

                res.header(headers.sessionToken, session.token)
                res.header(headers.sessionExpiration, session.expiresAt)
                res.header(headers.sessionUserId, session.userId)
                res.status(httpStatus.ok).send()
            }
            Log.info('controller', 'UserController :: Calling Endpoint :: Login')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'UserController :: Calling Endpoint :: Login'
            next(error)
        }
    }

    public static readonly logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const session = getDataFromPreviousMiddleware(reqData.token, req, next)

            const result = await collections.sessions.deleteOne({ token: session })

            if (result.deletedCount === 0) {
                next(new NotFound())
                next()
            } else if (result.deletedCount > 0) {
                res.status(httpStatus.ok).send()
            } else {
                next(new InternalServerError())
                next()
            }
            Log.info('controller', 'UserController :: Calling Endpoint :: Logout')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'UserController :: Calling Endpoint :: Logout'
            next(error)
        }
    }

    public static readonly logoutAllDevices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)

            const result = await collections.sessions.deleteMany(filter)

            if (result.deletedCount === 0) {
                next(new NotFound())
                next()
            } else if (result.deletedCount > 1) {
                res.status(httpStatus.ok).send()
            } else {
                next(new InternalServerError())
                next()
            }
            Log.info('controller', 'UserController :: Calling Endpoint :: LogoutAllDevices')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'UserController :: Calling Endpoint :: LogoutAllDevices'
            next(error)
        }
    }

    public static readonly loginConfirmation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const confirmationData = getDataFromPreviousMiddleware(reqData.confirmationData, req, next)
            const session = confirmSession(confirmationData)

            const result = await collections.sessions.findOneAndUpdate(session.filter, session.query, { returnDocument: 'after' })

            if (result) {
                const user = await collections.users.findOne(
                    { _id: result.userId },
                    {
                        projection: {
                            _id: 1,
                            accessLevel: 1,
                            name: 1,
                            pronouns: 1
                        }
                    }
                )
                if (user) {
                    res.status(httpStatus.ok).send(user)
                } else {
                    next(new InternalServerError())
                    next()
                }
            } else {
                next(new InternalServerError())
                next()
            }
            Log.info('controller', 'UserController :: Calling Endpoint :: LoginConfirmation')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'UserController :: Calling Endpoint :: LoginConfirmation'
            next(error)
        }
    }

    public static readonly getSessionsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)
            const page = getDataFromPreviousMiddleware(reqData.page, req, next)
            const limit = getDataFromPreviousMiddleware(reqData.limit, req, next)

            const result = await collections.sessions.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray()

            if (result) {
                res.status(httpStatus.ok).send({
                    count: result.length,
                    page: page,
                    limit: limit,
                    sessions: result
                })
            } else {
                next(new InternalServerError())
                next()
            }
            Log.info('controller', 'AdminController :: Calling Endpoint :: GetAllSessions')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'AdminController :: Calling Endpoint :: GetAllSessions'
            next(error)
        }
    }
}
