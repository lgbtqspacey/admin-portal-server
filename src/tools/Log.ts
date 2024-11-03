import { LogInfo, Tag } from '../types/Log'

export default class Log {
    private static readonly _timestamp = new Date().toISOString()
    private static readonly _separator = '\n----------------------------------------------------------------\n'

    public static readonly debug = (tag: Tag, message: string, details?: object): void => {
        const log: LogInfo = {
            message: this._maskString(message),
            tag: tag,
            timestamp: this._timestamp,
            level: 'debug',
        }
        if (details) log.details = this._maskObject(details)

        console.debug(this._separator, log)
    }

    public static readonly info = (tag: Tag, message: string, details?: object): void => {
        const log: LogInfo = {
            message: this._maskString(message),
            tag: tag,
            timestamp: this._timestamp,
            level: 'info',
        }
        if (details) log.details = this._maskObject(details)

        console.info(this._separator, log)
    }

    public static readonly warn = (tag: Tag, message: string): void => {
        const log: LogInfo = {
            message: this._maskString(message),
            tag: tag,
            timestamp: this._timestamp,
            level: 'warn',
        }

        console.warn(this._separator, log)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static readonly error = (tag: Tag, message: string, error: any): void => {
        const log: LogInfo = {
            message: this._maskString(message),
            tag: tag,
            timestamp: this._timestamp,
            level: 'error',
            stacktrace: this._maskString(error.stack),
        }

        console.error(this._separator, log)
    }

    private static readonly _maskObject = (data: object): object => {
        const stringify = JSON.stringify(data)
        const mask = this._maskString(stringify)
        return JSON.parse(mask)
    }

    private static readonly _maskString = (data: string) => {
        const email = /"(email)+":[^,}]+/
        const name = /"(name)+":[^,}]+/
        const password = /"(password)+":[^,}]+/
        const id = /"(_id)+":[^,}]+/
        const username = /"(username)+":[^,}]+/
        const discord_id = /"(discord_id)+":[^,}]+/
        const user_id = /"(user_id)+":[^,}]+/
        const pronouns = /"(pronouns)+":[^,}]+/

        return data.toString()
            .replace(email, '"email": "**********"')
            .replace(name, '"name": "**********"')
            .replace(password, '"password": "**********"')
            .replace(id, '"_id": "**********"')
            .replace(discord_id, '"discord_id": "**********"')
            .replace(username, '"username": "**********"')
            .replace(user_id, '"user_id": "**********"')
            .replace(pronouns, '"pronouns": "**********"')
    }
}
