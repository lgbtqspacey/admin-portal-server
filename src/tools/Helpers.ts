import crypto from 'crypto'
import { NextFunction, Request } from 'express'
import { v4 as uuid } from 'uuid'
import { InternalServerError } from '../tools/Error'
import { ConfirmationData, DeviceInfo, Session, User } from '../types/Schemas'

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
export const createSession = (user: User, deviceInfo: DeviceInfo): Session => {
    return {
        _id: uuid(),
        userId: user._id!,
        token: crypto.randomBytes(32).toString('hex'),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        accessLevel: user.accessLevel,
        deviceInfo: deviceInfo,
        confirmed: false,
    }
}

/**
 * Add additional data to the session to save on the server
 */
export const confirmSession = (confirmation: ConfirmationData): { filter: object, query: object } => {
    const filter = { $and: [{ userId: confirmation.userId }, { token: confirmation.token }] }
    const query = { $set: { confirmed: true, confirmedAt: new Date().toISOString() } }

    return { filter, query }
}

/**
 * Refreshes the session with 30 days of expiration
 * @returns the data to update the session
 */
export const refreshSession = (userId: string, token: string): { filter: object, query: object } => {
    const filter = { $and: [{ userId: userId }, { token: token }] }
    const query = {
        $set: {
            updatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
    }

    return { filter, query }
}
