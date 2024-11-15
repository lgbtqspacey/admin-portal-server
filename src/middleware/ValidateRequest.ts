import { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { reportCreate, reportUpdate, roleCreate, roleUpdate, userCreate, userUpdate } from '../schema/document'
import { filterReport, filterUser, id, login } from '../schema/filter'
import { errorMessages, headers, reqData } from '../tools/Constants'
import { BadRequest } from '../tools/Error'
import Password from '../tools/Password'
import { ConfirmationData, Filter, FilterReport, Login, Report, Role, User } from '../types/Schemas'

export default class ValidateRequest {
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

    public static readonly id = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { error, value } = id.validate(req.params.id)

            if (error) {
                const message = error.details[0].message
                next(new BadRequest(message))
                next()
            } else {
                if (req.url.includes('/auth/logout/')) {
                    res.locals[reqData.filter] = { user_id: value }
                } else {
                    res.locals[reqData.filter] = { _id: value }
                }
                next()
            }
        } catch (error) {
            next(error)
        }
    }

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

    public static readonly logout = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.header(headers.sessionToken)

            if (!token) {
                next(new BadRequest(errorMessages.authNotProvided))
                next()
            } else {
                res.locals[reqData.token] = token
                next()
            }
        } catch (error) {
            next(error)
        }
    }

    public static readonly loginConfirmation = (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.header(headers.sessionToken)
            const userId = req.header(headers.sessionUserId)
            const expiresAt = req.header(headers.sessionExpiresAt)
            const deviceOS = req.header(headers.sessionDeviceOS)
            const deviceIp = req.header(headers.sessionDeviceIp)
            const deviceLocation = req.header(headers.sessionDeviceLocation)

            if (!token || !userId || !deviceOS || !deviceIp || !deviceLocation || !expiresAt) {
                next(new BadRequest(errorMessages.authNotProvided))
                next()
            } else {
                const confirmationData: ConfirmationData = {
                    user_id: userId,
                    token: token,
                    expires_at: expiresAt,
                    device_info: { os: deviceOS, ip: deviceIp, location: deviceLocation }
                }
                res.locals[reqData.confirmationData] = confirmationData
                next()
            }
        } catch (error) {
            next(error)
        }
    }
}
