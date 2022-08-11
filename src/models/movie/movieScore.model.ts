import { Table, Column, Model, PrimaryKey, NotNull, IsDecimal } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieScore extends Model {
    @PrimaryKey
    @Column
    id: number

    @NotNull
    @Column
    movieId: number

    @NotNull
    @Column
    userId: number

    @IsDecimal
    @Column
    score: number
}