import joi from 'joi'

const reportCreate = joi.object({
    user_id: joi.string().required(),
    type: joi.string().required(),
    is_first_occurrence: joi.boolean().required(),
    severity: joi.string().required(),
    description: joi.string().required(),
    date: joi.string().isoDate().required(),
    time: joi.string().required(),
    place: joi.string().required(),
    additional_info: joi.string().required(),
    followup: joi.string().required().allow(''),
    witnesses: joi.array().items(joi.object({
        name: joi.string().required(),
        contact_info: joi.string().required(),
        relation: joi.string().required(),
        report: joi.string().required(),
    }).required()),
    people_involved: joi.array().items(joi.object({
        name: joi.string().required(),
        contact_info: joi.string().required(),
        relation: joi.string().required(),
        report: joi.string().required(),
    }).required()),
    created_by: joi.string().required(),
})

const reportUpdate = joi.object({
    id: joi.string().guid({ version: ['uuidv4'] }).required(),
}).concat(reportCreate)

const roleCreate = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    functions: joi.array().items(joi.string().required()),
})

const roleUpdate = joi.object({
    id: joi.string().guid({ version: ['uuidv4'] }).required(),
}).concat(roleCreate)

const userCreate = joi.object({
    is_admin: joi.boolean().required().default(false),
    name: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.when('is_admin', {
        is: true,
        then: joi.string().min(8).max(64).required(),
        otherwise: joi.not()
    }),
    discord_id: joi.string(),
    roles: joi.array().items(joi.string()).required(),
    date_of_birth: joi.string().required(),
    pronouns: joi.string().required(),
    phone: joi.string().required(),
    joined_at: joi.string().required(),
    left_at: joi.string().default(null),
    created_by: joi.string().required(),
})

const userUpdate = joi.object({
    id: joi.string().guid({ version: ['uuidv4'] }).required(),
    is_admin: joi.boolean(),
    name: joi.string(),
    username: joi.string(),
    email: joi.string().email(),
    password: joi.string().min(8).max(64),
    discord_id: joi.string(),
    roles: joi.array().items(joi.string()),
    date_of_birth: joi.string(),
    pronouns: joi.string(),
    phone: joi.string(),
    joined_at: joi.string(),
    left_at: joi.string(),
}).or(
    'is_admin',
    'name',
    'username',
    'email',
    'password',
    'discord_id',
    'roles',
    'date_of_birth',
    'pronouns',
    'phone',
    'joined_at',
    'left_at',
).required()

export { reportCreate, reportUpdate, roleCreate, roleUpdate, userCreate, userUpdate }

