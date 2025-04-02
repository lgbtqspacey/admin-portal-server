import {
    AutoIncrement,
    Column,
    Model,
    NotNull,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript'

@Table
export default class Team extends Model {
    @PrimaryKey
    @NotNull
    @AutoIncrement
    @Unique
    @Column
        id!: number

    @NotNull
    @Unique
    @Column
        code!: string

    @NotNull
    @Column
        name!: string
}
