import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { MongoServerError } from 'mongodb'
import { errorMessages, httpStatus, mongoDBErrors, reqData } from '../tools/Constants'
import { BaseError } from '../tools/Error'
import Log from '../tools/Log'
import { Tag } from '../types/Log'

export default class ErrorHandler {
    /**
   * Handles errors in HTTP operations
   */
    public static readonly httpErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
        const tag = req.res?.locals[reqData.logTag] ?? 'error_handler'
        const trigger = req.res?.locals[reqData.logTrigger] ?? ''

        switch (true) {
            case err instanceof BaseError: return this._baseError(err, res, tag, trigger)
            case err instanceof MongoServerError: return this._mongoDbError(err, res, tag, trigger)
            case err instanceof JsonWebTokenError: return this._unauthorizedError(err, res, tag, trigger)
            case err instanceof SyntaxError: return this._syntaxError(err, res, tag, trigger)
            default: {
                Log.error('error_handler', `${err.message}`, err)
                return res.status(httpStatus.internalServerError).json({ error: err.message })
            }
        }
    }

    /**
  * Handles base error
  * @returns Response with generic error
  */
    private static readonly _baseError = (err: BaseError, res: Response, tag: Tag, trigger: string) => {
        if (err.isOperational) {
            return res.status(err.status).json({
                status: 'error',
                message: err.message
            })
        } else {
            Log.error(tag, `${trigger} => ${err.message}`, err)
            return res.status(err.status).json({ message: errorMessages.generic })
        }
    }

    /**
   * Handles authorization errors
   * @returns Response with unauthorized error code and its message
   * @see JsonWebToken {@link https://www.npmjs.com/package/jsonwebtoken}
   */
    private static readonly _unauthorizedError = (err: Error, res: Response, tag: Tag, trigger: string) => {
        Log.error(tag, `${trigger} => ${err.message}`, err)
        return res.status(httpStatus.unauthorized).json({ error: err.message })
    }

    /**
   * Handles syntax errors
   * @returns Response with bad request error code and its message
   */
    private static readonly _syntaxError = (err: SyntaxError, res: Response, tag: Tag, trigger: string) => {
        Log.error(tag, `${trigger} => ${err.message}`, err)
        return res.status(httpStatus.badRequest).json({ error: errorMessages.badRequest })
    }

    /**
   * Handles MongoDB errors
   * @returns Response with the error code and its message
   * @see MongoDB {@link https://www.npmjs.com/package/mongodb}
   */
    private static readonly _mongoDbError = (err: MongoServerError, res: Response, tag: Tag, trigger: string) => {
        if (err.code === mongoDBErrors.duplicateKey) {
            Log.error(tag, `${trigger} => ${err.message}`, err)
            return res.status(httpStatus.conflict).json({ error: errorMessages.conflict })
        } else {
            Log.error(tag, `${trigger} => ${err.message}`, err)
            return res.status(httpStatus.internalServerError).json({ error: errorMessages.internalServerError })
        }
    }
}
