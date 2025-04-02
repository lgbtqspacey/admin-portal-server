import {
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    NotNull,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript'
import Team from './Team'

@Table
export default class Role extends Model {
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

    @NotNull
    @ForeignKey(() => Team)
    @Column
        teamId!: number

    @BelongsTo(() => Team)
        team!: Team
}
