import crypto from 'crypto'
import { NextFunction, Request } from 'express'
import { v4 as uuid } from 'uuid'
import { InternalServerError } from '../tools/Error'
import { ConfirmationData, Session } from '../types/Schemas'

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
 * Generates a user session
 */
export const createSession = (userId: string): Session => {
    return {
        user_id: userId,
        token: crypto.randomBytes(32).toString('hex'),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
}

/**
 * Add additional data to the session to save on the server
 */
export const confirmSession = (confirmation: ConfirmationData): Session => {
    return {
        _id: uuid(),
        created_at: new Date().toISOString(),
        user_id: confirmation.user_id,
        token: confirmation.token,
        expires_at: confirmation.expires_at,
        device_info: confirmation.device_info
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
