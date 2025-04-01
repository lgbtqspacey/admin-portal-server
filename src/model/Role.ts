import { DataTypes, Deferrable } from 'sequelize'
import { sequelize } from '../server'
import Team from './Team'

const Role = sequelize.define(
    'Role',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        teamId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Team,
                key: 'id',
                deferrable: new Deferrable.INITIALLY_IMMEDIATE,
            }
        },
    },
    {
        tableName: 'roles',
        indexes: [
            { unique: true, fields: ['id', 'code'] },
            { unique: false, fields: ['teamId'] },
        ],
    },
)

export default Role

