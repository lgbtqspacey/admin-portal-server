import joi from 'joi'

export default class FilterSchema {
    public static readonly id = joi.string().guid({ version: ['uuidv4'] }).required()

    public static readonly login = joi.object({
        email: joi.string().email(),
        username: joi.string(),
        password: joi.string().required(),
    }).or('email', 'username').required()

    public static readonly filterDefault = joi.object({
        page: joi.number().integer().min(1).default(1),
        limit: joi.number().integer().min(1).max(50).default(10),
    })

    public static readonly filterUser = joi.object({
        email: joi.string().email(),
        discordId: joi.string(),
        id: joi.string().guid({ version: ['uuidv4'] }),
        username: joi.string(),
    }).concat(this.filterDefault)

    public static readonly filterReport = joi.object({
        userId: joi.string().guid({ version: ['uuidv4'] }).required(),
        to: joi.string().isoDate(),
        from: joi.when('to', {
            is: joi.exist(),
            then: joi.string().isoDate().required(),
            otherwise: joi.not()
        }),
    }).concat(this.filterDefault)

    public static readonly filterSession = joi.object({
        userId: joi.string().guid({ version: ['uuidv4'] }).required(),
    }).concat(this.filterDefault)
}
