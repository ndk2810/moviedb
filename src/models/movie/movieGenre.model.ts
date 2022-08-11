import { Table, Column, Model, PrimaryKey, NotNull, AllowNull } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieGenre extends Model {
    @PrimaryKey
    @Column
    id: number

    @AllowNull(false)
    @Column
    movieId: number

    @AllowNull(false)
    @Column
    genreId: number
}