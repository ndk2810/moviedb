import { Table, Column, Model, PrimaryKey, NotNull, IsDecimal, AllowNull, AutoIncrement } from 'sequelize-typescript'

@Table({
    timestamps: false,
    tableName: "moviescores"
})
export class MovieScore extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @AllowNull(false)
    @Column
    movieId: number

    @AllowNull(false)
    @Column
    userId: number

    @AllowNull(false)
    @IsDecimal
    @Column
    score: number
}