import { NextFunction, Request, Response } from 'express'
import { BadRequest } from '../tools/Error'
import { errorMessages } from '../tools/Constants'
import JWT from '../tools/JWT'

export default class Auth {
    /**
     * Verifies JWT from headers
     * 
     * @throws `BadRequest` If JWT is not provided
     * @throws `JsonWebTokenError` If JWT is invalid
     */
    public static readonly jwt = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1]

            if (!token) {
                next(new BadRequest(errorMessages.authNotProvided))
                next()
            } else {
                JWT.verify(token, next)
                next()
            }
        } catch (error) {
            next(error)
        }
    }
}
