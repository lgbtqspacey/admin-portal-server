import { DataTypes, Deferrable } from 'sequelize'
import { sequelize } from '../server'
import AccessLevel from './AccessLevel'
import Role from './Role'

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        accessLevelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: AccessLevel,
                key: 'id',
                deferrable: new Deferrable.INITIALLY_IMMEDIATE
            }
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Role,
                key: 'id',
                deferrable: new Deferrable.INITIALLY_IMMEDIATE
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        discordId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pronouns: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        joinedAt: {
            type: DataTypes.STRING,
            allowNull: false
        },
        leftAt: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'users'
    }
)

export default User
