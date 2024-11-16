import joi from 'joi'

const id = joi.string().guid({ version: ['uuidv4'] }).required()

const login = joi.object({
    email: joi.string().email(),
    username: joi.string(),
    password: joi.string().required(),
}).or('email', 'username').required()

const filterDefault = joi.object({
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(50).default(10),
})

const filterUser = joi.object({
    name: joi.string(),
    email: joi.string().email(),
    discordId: joi.string(),
    id: joi.string().guid({ version: ['uuidv4'] }),
    username: joi.string(),
}).concat(filterDefault)

const filterReport = joi.object({
    user_id: joi.string().guid({ version: ['uuidv4'] }).required(),
    to: joi.string().isoDate(),
    from: joi.when('to', {
        is: joi.exist(),
        then: joi.string().isoDate().required(),
        otherwise: joi.not()
    }),
}).concat(filterDefault)

export { filterUser, filterReport, id, login }
