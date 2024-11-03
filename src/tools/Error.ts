import { httpStatus, errorMessages} from './Constants'
import { MongoServerError } from 'mongodb'

export class BaseError extends Error {
    status: number
    isOperational: boolean

    constructor(message: string, status: number, isOperational: boolean = true) {
        super(message)
        this.status = status
        this.isOperational = isOperational
        Object.setPrototypeOf(this, BaseError.prototype)
    }
}

export class NotFound extends BaseError {
    constructor(message: string = errorMessages.notFound) {
        super(message, httpStatus.notFound)
        Object.setPrototypeOf(this, NotFound.prototype)
    }
}

export class Conflict extends MongoServerError {
    constructor(message: string) {
        super({ message })
        Object.setPrototypeOf(this, Conflict.prototype)
    }
}

export class BadRequest extends BaseError {
    constructor(message: string = errorMessages.badRequest) {
        super(message, httpStatus.badRequest)
        Object.setPrototypeOf(this, BadRequest.prototype)
    }
}

export class InternalServerError extends BaseError {
    constructor(message: string = errorMessages.internalServerError) {
        super(message, httpStatus.internalServerError)
        Object.setPrototypeOf(this, InternalServerError.prototype)
    }
}

export class Unauthorized extends BaseError {
    constructor(message: string = errorMessages.unauthorized) {
        super(message, httpStatus.unauthorized)
        Object.setPrototypeOf(this, Unauthorized.prototype)
    }
}
