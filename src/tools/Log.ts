import { Tag } from '../types/Log'

export default class Log {
    private static readonly _timestamp = new Date().toISOString()
    private static readonly _separator = '\n----------------------------------------------------------------\n'

    public static readonly debug = (tag: Tag, message: string, details?: object): void => {
        const log = `${this._timestamp} - [DEBUG] :: ${tag} :: ${this._maskString(message)}`

        if (details) {
            const maskDetails = this._maskObject(details)
            console.debug(this._separator, log, ':: details:', maskDetails)
        } else {
            console.debug(this._separator, log)
        }
    }

    public static readonly info = (tag: Tag, message: string, details?: object): void => {
        const log = `${this._timestamp} - [INFO] :: ${tag} :: ${this._maskString(message)}`

        if (details) {
            const maskDetails = this._maskObject(details)
            console.debug(this._separator, log, ':: details:', maskDetails)
        } else {
            console.debug(this._separator, log)
        }
    }

    public static readonly warn = (tag: Tag, message: string): void => {
        const log = `${this._timestamp} - [WARN] :: ${tag} :: ${this._maskString(message)}`

        console.warn(this._separator, log)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static readonly error = (tag: Tag, message: string, error: any): void => {
        const log = `${this._timestamp} - [ERROR] :: ${tag} :: ${this._maskString(message)}`
        const stacktrace = this._maskString(error.stack)

        console.error(this._separator, log, ':: error:', stacktrace)
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
