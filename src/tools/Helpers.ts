import { NextFunction, Request } from 'express'
import { InternalServerError } from '../tools/Error'

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
