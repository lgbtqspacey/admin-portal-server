import { DataTypes, Deferrable } from 'sequelize'
import { sequelize } from '../server'
import User from './User'

const Session = sequelize.define(
    'Session',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
                deferrable: new Deferrable.INITIALLY_IMMEDIATE,
            }
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deviceIp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deviceOs: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        region: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        confirmed: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: false,
        },
        confirmedAt: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        tableName: 'sessions',
        indexes: [
            { unique: true, fields: ['id', 'token'] },
            { unique: false, fields: ['userId'] },
        ],
    },
)

export default Session
