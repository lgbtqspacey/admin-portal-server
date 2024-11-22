import { NextFunction, Request, Response } from 'express'
import { collections } from '../server'
import { httpStatus, reqData } from '../tools/Constants'
import { InternalServerError, NotFound } from '../tools/Error'
import { getDataFromPreviousMiddleware } from '../tools/Helpers'
import Log from '../tools/Log'

export default class AdminController {
    public static readonly createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = getDataFromPreviousMiddleware(reqData.userCreate, req, next)

            const result = await collections.users.insertOne(user)

            if (result) {
                res.status(httpStatus.created).send({ id: result.insertedId })
            } else {
                next(new InternalServerError())
                next()
            }

            Log.info('controller', 'AdminController :: Calling Endpoint :: CreateUser')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'AdminController :: Calling Endpoint :: CreateUser'
            next(error)
        }
    }

    public static readonly getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)
            const projection = getDataFromPreviousMiddleware(reqData.projection, req, next)
            const page = getDataFromPreviousMiddleware(reqData.page, req, next)
            const limit = getDataFromPreviousMiddleware(reqData.limit, req, next)

            const result = await collections.users.find(filter, { projection: projection })
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray()

            if (result) {
                res.status(httpStatus.ok).send({
                    count: result.length,
                    page: page,
                    limit: limit,
                    users: result
                })
            } else {
                next(new NotFound())
                next()
            }
            Log.info('controller', 'AdminController :: Calling Endpoint :: GetUser')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'AdminController :: Calling Endpoint :: GetUser'
            next(error)
        }
    }

    public static readonly updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)
            const update = getDataFromPreviousMiddleware(reqData.userUpdate, req, next)

            const result = await collections.users.findOneAndUpdate(filter, update, { returnDocument: 'after', projection: { password: 0 } })

            if (result) {
                res.status(httpStatus.ok).send(result)
            } else {
                next(new NotFound())
                next()
            }

            Log.info('controller', 'AdminController :: Calling Endpoint :: UpdateUser')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'AdminController :: Calling Endpoint :: UpdateUser'
            next(error)
        }
    }

    public static readonly deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)

            const result = await collections.users.deleteOne(filter)

            if (result?.deletedCount) {
                res.status(httpStatus.noContent).send()
            } else {
                next(new NotFound())
                next()
            }
            Log.info('controller', 'AdminController :: Calling Endpoint :: DeleteUser')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'AdminController :: Calling Endpoint :: DeleteUser'
            next(error)
        }
    }
}
