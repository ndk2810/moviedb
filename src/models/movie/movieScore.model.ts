import { Table, Column, Model, PrimaryKey, NotNull, IsDecimal, AllowNull } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieScore extends Model {
    @PrimaryKey
    @Column
    id: number

    @AllowNull(false)
    @Column
    movieId: number

    @AllowNull(false)
    @Column
    userId: number

    @IsDecimal
    @Column
    score: number
}