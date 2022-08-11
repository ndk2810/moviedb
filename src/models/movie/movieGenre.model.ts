import { Table, Column, Model, PrimaryKey, NotNull } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieGenre extends Model {
    @PrimaryKey
    @Column
    id: number

    @NotNull
    @Column
    movieId: number

    @NotNull
    @Column
    genreId: number
}