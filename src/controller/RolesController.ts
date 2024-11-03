import { NextFunction, Request, Response } from 'express'
import { collections } from '../server'
import { httpStatus, reqData } from '../tools/Constants'
import { InternalServerError, NotFound } from '../tools/Error'
import { getDataFromPreviousMiddleware } from '../tools/Helpers'
import Log from '../tools/Log'

export default class RolesController {
    /**
     * Creates a new role.
     * 
     * @see `ValidateRequest.ts` for validation rules.
     * @throws `InternalServerError` If the role could not be created.
     */
    public static readonly createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const role = getDataFromPreviousMiddleware(reqData.roleCreate, req, next)

            const result = await collections.people.roles.insertOne(role)

            if (result) {
                res.status(httpStatus.created).send(result)
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

    /**
     * Returns all roles.
     * 
     * @see `ValidateRequest.ts` for validation rules.
     * @throws `InternalServerError` If the roles could not be found.
     */
    public static readonly getRoles = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = getDataFromPreviousMiddleware(reqData.page, _req, next)
            const limit = getDataFromPreviousMiddleware(reqData.limit, _req, next)

            const result = await collections.people.roles.find()
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


    /**
     * Updates an existing role.
     * 
     * @see `ValidateRequest.ts` for validation rules.
     * @throws `NotFound` If the role could not be found.
     */
    public static readonly updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)
            const update = getDataFromPreviousMiddleware(reqData.roleUpdate, req, next)

            const result = await collections.people.roles.findOneAndUpdate(filter, update, { returnDocument: 'after' })

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

    /**
     * Deletes an existing role.
     * 
     * @see `ValidateRequest.ts` for validation rules.
     * @throws `NotFound` If the role could not be found.
     */
    public static readonly deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)

            const result = await collections.people.roles.deleteOne(filter)

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
