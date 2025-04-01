import { DataTypes } from 'sequelize'
import { sequelize } from '../server'
import { accessLevel } from '../tools/Constants'

const AccessLevel = sequelize.define(
    'AccessLevel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        code: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: [...Object.values(accessLevel)],
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'access_levels',
        indexes: [{ unique: true, fields: ['id', 'code'] }],
    },
)

export default AccessLevel

