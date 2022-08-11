import { Table, Column, Model, PrimaryKey, Length, NotNull } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieActor extends Model {
    @PrimaryKey
    @Column
    id: number

    @NotNull
    @Column
    movieId: string

    @NotNull
    @Column
    actorId: string

    @Length({ min: 1, max: 45 })
    @Column
    role: string
}