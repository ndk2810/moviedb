import { Table, Column, Model, PrimaryKey, NotNull, Default, AllowNull } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieMedia extends Model {
    @PrimaryKey
    @Column
    id: number

    @AllowNull(false)
    @Column
    movieId: number

    @AllowNull(false)
    @Column
    url: string

    @Default(0)
    @Column
    mediaType: number
}