import { NextFunction, Request, Response } from 'express'
import { collections } from '../server'
import { errorMessages, headers } from '../tools/Constants'
import { BadRequest, Unauthorized } from '../tools/Error'
import { refreshSession } from '../tools/Helpers'

export default class Auth {
    public static readonly session = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const token = req.header(headers.sessionToken)

            if (!token) {
                next(new BadRequest(errorMessages.authNotProvided))
                next()
            } else {
                const result = await collections.auth.sessions.findOne({ token: token })

                if (!result) {
                    next(new Unauthorized(errorMessages.unauthorized))
                    next()
                } else {
                    const now = new Date().toISOString()

                    if (result.expires_at < now) {
                        next(new Unauthorized(errorMessages.unauthorized))
                        next()
                    } else {
                        const refresh = refreshSession()
                        await collections.auth.sessions.updateOne({ _id: result._id }, { $set: refresh })
                        next()
                    }
                }
            }
        } catch (error) {
            next(error)
        }
    }
}
