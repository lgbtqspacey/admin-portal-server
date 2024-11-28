import joi from 'joi'
import { accessLevel } from '../tools/Constants'

export default class DocumentSchema {
    public static readonly reportCreate = joi.object({
        userId: joi.string().required(),
        type: joi.string().required(),
        isFirstOccurrence: joi.boolean().required(),
        severity: joi.string().required(),
        description: joi.string().required(),
        date: joi.string().isoDate().required(),
        time: joi.string().required(),
        place: joi.string().required(),
        additionalInfo: joi.string().required(),
        followup: joi.string().required().allow(''),
        witnesses: joi.array().items(joi.object({
            name: joi.string().required(),
            contactInfo: joi.string().required(),
            relation: joi.string().required(),
            report: joi.string().required(),
        }).required()),
        peopleInvolved: joi.array().items(joi.object({
            name: joi.string().required(),
            contactInfo: joi.string().required(),
            relation: joi.string().required(),
            report: joi.string().required(),
        }).required()),
        createdBy: joi.string().required(),
    })

    public static readonly reportUpdate = joi.object({
        id: joi.string().guid({ version: ['uuidv4'] }).required(),
    }).concat(this.reportCreate)

    public static readonly roleCreate = joi.object({
        name: joi.string().required(),
        description: joi.string().required(),
        functions: joi.array().items(joi.string().required()),
    })

    public static readonly roleUpdate = joi.object({
        id: joi.string().guid({ version: ['uuidv4'] }).required(),
    }).concat(this.roleCreate)

    public static readonly userCreate = joi.object({
        accessLevel: joi.string().valid(...Object.values(accessLevel)).required(),
        name: joi.string().required(),
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.when('is_admin', {
            is: true,
            then: joi.string().min(8).max(64).required(),
            otherwise: joi.not()
        }),
        discordId: joi.string(),
        roles: joi.array().items(joi.string()).required(),
        dateOfBirth: joi.string().required(),
        pronouns: joi.string().required(),
        phone: joi.string().required(),
        joinedAt: joi.string().required(),
        leftAt: joi.string().default(null),
        createdBy: joi.string().required(),
    })

    public static readonly userUpdate = joi.object({
        id: joi.string().guid({ version: ['uuidv4'] }).required(),
        accessLevel: joi.string().valid(...Object.values(accessLevel)),
        name: joi.string(),
        username: joi.string(),
        email: joi.string().email(),
        password: joi.string().min(8).max(64),
        discordId: joi.string(),
        roles: joi.array().items(joi.string()),
        dateOfBirth: joi.string(),
        pronouns: joi.string(),
        phone: joi.string(),
        joinedAt: joi.string(),
        leftAt: joi.string(),
    }).or(
        'accessLevel',
        'name',
        'username',
        'email',
        'password',
        'discordId',
        'roles',
        'dateOfBirth',
        'pronouns',
        'phone',
        'joinedAt',
        'leftAt',
    ).required()
}
