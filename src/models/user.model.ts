import { Table, Column, Model, PrimaryKey, Length, IsEmail, AllowNull, Default, AutoIncrement } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @Length({ min: 1, max: 45 })
    @AllowNull(false)
    @Column
    username: string

    @Length({ min: 5, max: 60 })
    @IsEmail
    @AllowNull(false)
    @Column
    email: string

    @AllowNull(false)
    @Length({ min: 6, max: 450 })
    @Column
    password: string

    @AllowNull(false)
    @Default(0)
    @Column
    confirmed: number
}