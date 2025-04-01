import { DataTypes } from 'sequelize'
import { sequelize } from '../server'

const Team = sequelize.define(
    'Team',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'teams'
    }
)

export default Team

