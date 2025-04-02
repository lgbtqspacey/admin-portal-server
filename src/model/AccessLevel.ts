import {
    AutoIncrement,
    Column,
    Model,
    NotNull,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript'
import { accessLevel } from '../tools/Constants'

@Table
export default class AccessLevel extends Model {
    @PrimaryKey
    @NotNull
    @AutoIncrement
    @Unique
    @Column
        id!: number

    @NotNull
    @Unique
    @Column({
        values: [...Object.values(accessLevel)]
    })
        code!: string

    @NotNull
    @Column
        name!: string
}
