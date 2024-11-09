import crypto from 'crypto'
import { NextFunction, Request } from 'express'
import { v4 as uuid } from 'uuid'
import { InternalServerError } from '../tools/Error'
import { Session } from '../types/Schemas'

/**
 * Returns the data from the previous middleware
 * @throws `InternalServerError` If the data is not found
 */
export const getDataFromPreviousMiddleware = (key: string, req: Request, next: NextFunction) => {
    const data = req.res?.locals[key]

    if (!data) {
        next(new InternalServerError())
        next()
    } else {
        return data
    }
}


/**
 * Generates a refresh token with 30 days of expiration
 * @param userId
 * @returns the data to insert the session
 */
export const generateSession = (userId: string): Session => {
    return {
        _id: uuid(),
        user_id: userId,
        token: crypto.randomBytes(32).toString('hex'),
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
}

/**
 * Refreshes the session with 30 days of expiration
 * @returns the data to update the session
 */
export const refreshSession = (): Session => {
    return {
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
}
