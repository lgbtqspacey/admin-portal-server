import { NextFunction, Request, Response } from 'express'
import { collections } from '../server'
import { errorMessages } from '../tools/Constants'
import { BadRequest, Unauthorized } from '../tools/Error'
import { refreshSession } from 'src/tools/Helpers'

export default class Auth {
    /**
     * Verifies if the user is logged in.
     * 
     * Refreshes the session if it is not expired
     * 
     * @throws `Unauthorized` If the user is not logged
     * @throws `BadRequest` If the token is not provided
     */
    public static readonly session = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const token = req.header('session')

            if (token) {
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
