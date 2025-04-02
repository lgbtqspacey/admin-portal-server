import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    Model,
    NotNull,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript'
import User from './User'

@Table
export default class Session extends Model {
    @PrimaryKey
    @NotNull
    @AutoIncrement
    @Unique
    @Column
        id!: number

    @NotNull
    @ForeignKey(() => User)
    @Column
        userId!: number

    @BelongsTo(() => User)
        user!: User

    @NotNull
    @Unique
    @Column
        token!: string

    @NotNull
    @Column
        createdAt!: string

    @NotNull
    @Column
        expiresAt!: string

    @AllowNull
    @Column
        deviceIp!: string

    @AllowNull
    @Column
        deviceOs!: string

    @AllowNull
    @Column
        city!: string

    @AllowNull
    @Column
        region!: string

    @AllowNull
    @Column
        country!: string

    @NotNull
    @Default(false)
    @Column
        confirmed!: boolean

    @AllowNull
    @Default(null)
    @Column
        confirmedAt!: string
}
