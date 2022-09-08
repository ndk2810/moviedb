import { Table, Column, Model, PrimaryKey, Length, AllowNull, AutoIncrement, Default } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class MovieActor extends Model {
    @PrimaryKey
    @AutoIncrement
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
    
    @Default(0)
    @Column
    isDeleted: number
}