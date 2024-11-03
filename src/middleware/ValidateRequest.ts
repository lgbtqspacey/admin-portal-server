import { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { reportCreate, reportUpdate, roleCreate, roleUpdate, userCreate, userUpdate } from '../schema/document'
import { filterReport, filterUser, id, login } from '../schema/filter'
import { reqData } from '../tools/Constants'
import { BadRequest } from '../tools/Error'
import Password from '../tools/Password'
import { Filter, FilterReport, Login, Report, Role, User } from '../types/Schemas'

export default class ValidateRequest {
    /**
     * Validates query params and builds the database query filter from them.
     * 
     * Sends the filter to the next middleware in `req.res.locals.filter`.
     * 
     * @throws `BadRequest` If the validation fails
     */
    public static readonly filter = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error, value } = filterUser.validate(req.query)

            if (error) {
                const message = error.details[0].message
                next(new BadRequest(message))
                next()
            } else {
                const filter = []
                const data: Filter = value

                if (data.id) filter.push({ _id: data.id })
                if (data.email) filter.push({ email: data.email })
                if (data.discord_id) filter.push({ discord_id: data.discord_id })
                if (data.username) filter.push({ username: data.username })

                res.locals[reqData.page] = data.page
                res.locals[reqData.limit] = data.limit

                if (filter.length > 0) {
                    res.locals[reqData.filter] = { $and: filter }
                    res.locals[reqData.projection] = { password: 0 }
                } else {
                    res.locals[reqData.filter] = {}
                    res.locals[reqData.projection] = { _id: 1, name: 1, email: 1 }
                }
                next()
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Validates the filter for user reports then sends it to 
     * the next middleware in `req.res.locals.filterReports`.
     * 
     * @throws `BadRequest` If the validation fails
     */
    public static readonly filterReports = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error, value } = filterReport.validate(req.query)

            if (error) {
                const message = error.details[0].message
                next(new BadRequest(message))
                next()
            } else {
                const data: FilterReport = value
                const filter = []

                filter.push({ user_id: data.user_id })
                if (data.from && !data.to) {
                    data.to = new Date().toISOString()
                    filter.push({ date: { $gte: data.from, $lte: data.to } })
                } else if (data.from && data.to) {
                    filter.push({ date: { $gte: data.from, $lte: data.to } })
                }

                res.locals[reqData.page] = data.page
                res.locals[reqData.limit] = data.limit
                res.locals[reqData.filterReports] = { $and: filter }
                next()
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Validates the id from path params and builds the database query filter from it.
     * 
     * Sends the filter to the next middleware in `req.res.locals.filter`.
     * 
     * @throws `BadRequest` If the validation fails
     */
    public static readonly id = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error, value } = id.validate(req.params.id)

            if (error) {
                const message = error.details[0].message
                next(new BadRequest(message))
                next()
            } else {
                res.locals[reqData.filter] = { _id: value }
                next()
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Validates the request for report creation and update.
     * 
     * If the request is a POST, validates the body, creates id, timestamp and then
     * sends the report to the next middleware in `req.res.locals.reportCreate`.
     * 
     * If the request is a PUT, validates the body, removes id from the update data,
     * creates timestamp and then sends the report to the next middleware 
     * in `req.res.locals.reportUpdate`.
     *      
     * @throws `BadRequest` If the validation fails
     */
    public static readonly report = (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.method === 'POST') {
                const { error, value } = reportCreate.validate(req.body)

                if (error) {
                    const message = error.details[0].message
                    next(new BadRequest(message))
                    next()
                } else {
                    const report: Report = value

                    report._id = uuid()
                    report.created_at = new Date().toISOString()

                    res.locals[reqData.reportCreate] = report
                    next()
                }
            } else if (req.method === 'PUT') {
                const { error, value } = reportUpdate.validate({ ...req.params, ...req.body })

                if (error) {
                    const message = error.details[0].message
                    next(new BadRequest(message))
                    next()
                } else {
                    const report: Report = value
                    report.updated_at = new Date().toISOString()

                    res.locals[reqData.filter] = { _id: report.id }

                    delete report.id

                    res.locals[reqData.reportUpdate] = { $set: report }
                    next()
                }
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Validates the request for role creation and update.
     * 
     * If the request is a POST, validates the body, creates id, timestamp and then
     * sends the role to the next middleware in `req.res.locals.roleCreate`.
     * 
     * If the request is a PUT, validates the body, removes id from the update data,
     * creates timestamp and then sends the role to the next middleware 
     * in `req.res.locals.roleUpdate`.     
     *
     * @throws `BadRequest` If the validation fails
     */
    public static readonly role = (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.method === 'POST') {
                const { error, value } = roleCreate.validate(req.body)

                if (error) {
                    const message = error.details[0].message
                    next(new BadRequest(message))
                    next()
                } else {
                    const role: Role = value

                    role._id = uuid()
                    role.created_at = new Date().toISOString()

                    res.locals[reqData.roleCreate] = role
                    next()
                }
            } else if (req.method === 'PUT') {
                const { error, value } = roleUpdate.validate({ ...req.params, ...req.body })

                if (error) {
                    const message = error.details[0].message
                    next(new BadRequest(message))
                    next()
                } else {
                    const role: Role = value

                    role.updated_at = new Date().toISOString()
                    res.locals[reqData.filter] = { _id: role.id }

                    delete role.id

                    res.locals[reqData.roleUpdate] = { $set: role }
                    next()
                }
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Validates the request for user creation and update.
     * 
     * If the request is a POST, validates the body, creates id, timestamp and then
     * sends the user to the next middleware in `req.res.locals.userCreate`.
     * 
     * If the request is a PATCH, validates the body, removes id from the update data,
     * creates timestamp and then sends the user to the next middleware
     * in `req.res.locals.userUpdate`.
     * 
     * @throws `BadRequest` If the validation fails
     */
    public static readonly user = (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.method === 'POST') {
                const { error, value } = userCreate.validate(req.body)

                if (error) {
                    const message = error.details[0].message
                    next(new BadRequest(message))
                    next()
                } else {
                    const user: User = value
                    user.password = Password.encrypt(value.password)
                    user.created_at = new Date().toISOString()
                    user._id = uuid()

                    res.locals[reqData.userCreate] = user
                    next()
                }
            } else if (req.method === 'PATCH') {
                const { error, value } = userUpdate.validate({ ...req.params, ...req.body })

                if (error) {
                    const message = error.details[0].message
                    next(new BadRequest(message))
                    next()
                } else {
                    const user: User = value

                    if (value.password) user.password = Password.encrypt(value.password)
                    user.updated_at = new Date().toISOString()
                    res.locals[reqData.filter] = { _id: user.id }

                    delete user.id

                    res.locals[reqData.userUpdate] = { $set: user }
                    next()
                }
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Validates the request for login. It accepts either `email` or `username`.
     * The `password` is always required.
     * 
     * The `email` or `username` are sent to the next middleware in `req.res.locals.filter`.
     *
     * The Hash of the `password` is sent to the next middleware in `req.res.locals.password`.
     * 
     * @throws `BadRequest` If the validation fails
     */
    public static readonly login = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error, value } = login.validate(req.body)

            if (error) {
                const message = error.details[0].message
                next(new BadRequest(message))
                next()
            } else {
                const filter = []
                const login: Login = value

                const password = Password.encrypt(value.password)
                delete login.password

                if (login.email) filter.push({ email: login.email })
                if (login.username) filter.push({ username: login.username })

                res.locals[reqData.filter] = { $and: filter }
                res.locals[reqData.password] = password
                next()
            }
        } catch (error) {
            next(error)
        }
    }
}
