import { Table, Column, Model, PrimaryKey, AllowNull, AutoIncrement, Default } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieGenre extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @AllowNull(false)
    @Column
    movieId: number

    @AllowNull(false)
    @Column
    genreId: number

    @Default(0)
    @Column
    isDeleted: number
}