import { Table, Column, Model, PrimaryKey, NotNull, Default } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieMedia extends Model {
    @PrimaryKey
    @Column
    id: number

    @NotNull
    @Column
    movieId: number

    @NotNull
    @Column
    url: string

    @Default(0)
    @Column
    mediaType: number
}