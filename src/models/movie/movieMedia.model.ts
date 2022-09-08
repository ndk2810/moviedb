import { Table, Column, Model, PrimaryKey, Default, AllowNull, AutoIncrement } from 'sequelize-typescript'

@Table({
    timestamps: false,
    tableName: "moviemedias"
})
export class MovieMedia extends Model {
    @PrimaryKey
    @AutoIncrement
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

    @Default(0)
    @Column
    isDeleted: number
}