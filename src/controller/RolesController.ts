import { NextFunction, Request, Response } from 'express'
import { collections } from '../server'
import { httpStatus, reqData } from '../tools/Constants'
import { InternalServerError, NotFound } from '../tools/Error'
import { getDataFromPreviousMiddleware } from '../tools/Helpers'
import Log from '../tools/Log'

export default class RolesController {
    public static readonly createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const role = getDataFromPreviousMiddleware(reqData.roleCreate, req, next)

            const result = await collections.roles.insertOne(role)

            if (result) {
                res.status(httpStatus.created).send({ id: result.insertedId })
            } else {
                next(new InternalServerError())
                next()
            }

            Log.info('controller', 'RolesController :: Calling Endpoint :: CreateRole')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'RolesController :: Calling Endpoint :: CreateRole'
            next(error)
        }
    }

    public static readonly getRoles = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = getDataFromPreviousMiddleware(reqData.page, _req, next)
            const limit = getDataFromPreviousMiddleware(reqData.limit, _req, next)

            const result = await collections.roles.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray()

            if (result) {
                res.status(httpStatus.ok).send({
                    count: result.length,
                    page: page,
                    limit: limit,
                    roles: result
                })
            } else {
                next(new InternalServerError())
                next()
            }
            Log.info('controller', 'RolesController :: Calling Endpoint :: GetRoles')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'RolesController :: Calling Endpoint :: GetRoles'
            next(error)
        }
    }

    public static readonly updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)
            const update = getDataFromPreviousMiddleware(reqData.roleUpdate, req, next)

            const result = await collections.roles.findOneAndUpdate(filter, update, { returnDocument: 'after' })

            if (result) {
                res.status(httpStatus.ok).send(result)
            } else {
                next(new NotFound())
                next()
            }

            Log.info('controller', 'RolesController :: Calling Endpoint :: UpdateRole')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'RolesController :: Calling Endpoint :: UpdateRole'
            next(error)
        }
    }

    public static readonly deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)

            const result = await collections.roles.deleteOne(filter)

            if (result?.deletedCount) {
                res.status(httpStatus.noContent).send()
            } else {
                next(new NotFound())
                next()
            }
            Log.info('controller', 'RolesController :: Calling Endpoint :: DeleteRole')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'RolesController :: Calling Endpoint :: DeleteRole'
            next(error)
        }
    }
}
