import { Table, Column, Model, PrimaryKey, Length, NotNull, AllowNull } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieActor extends Model {
    @PrimaryKey
    @Column
    id: number

    @AllowNull(false)
    @Column
    movieId: string

    @AllowNull(false)
    @Column
    actorId: string

    @Length({ min: 1, max: 45 })
    @Column
    role: string
}