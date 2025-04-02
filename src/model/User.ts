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
import AccessLevel from './AccessLevel'
import Role from './Role'

@Table
export default class User extends Model {
    @PrimaryKey
    @NotNull
    @AutoIncrement
    @Unique
    @Column
        id!: number

    @NotNull
    @ForeignKey(() => AccessLevel)
    @Column
        accessLevelId!: number

    @BelongsTo(() => AccessLevel)
        accessLevel!: AccessLevel

    @NotNull
    @ForeignKey(() => Role)
    @Column
        roleId!: number

    @BelongsTo(() => Role)
        role!: Role

    @NotNull
    @Column
        name!: string

    @NotNull
    @Unique
    @Column
        email!: string    

    @NotNull
    @Unique
    @Column
        username!: string

    @NotNull
    @Column
        password!: string

    @NotNull
    @Unique
    @Column
        discordId!: string

    @NotNull
    @Column
        dateOfBirth!: string

    @NotNull
    @Column
        pronouns!: string

    @NotNull
    @Column
        phone!: string

    @NotNull
    @Column
        joinedAt!: string

    @AllowNull
    @Column
    @Default(null)
        leftAt!: string | null

    @NotNull
    @Column
        createdAt!: string

    @NotNull
    @Column
        createdBy!: string
}
