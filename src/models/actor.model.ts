import { Table, Column, Model, PrimaryKey, Max, Length, Default, AllowNull, AutoIncrement } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class Actor extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @Length({ min: 1, max: 45 })
    @AllowNull(false)
    @Default("No biography written for this actor/actress, yet.")
    @Column
    name: string

    @Column
    bio: string

    @Max(2)
    @Default(0)
    @Column
    gender: number

    @Length({ min: 0, max: 60 })
    @Column
    profilePic: string
}