import { Table, Column, Model, PrimaryKey, Length, NotNull, IsEmail, AllowNull, Default } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class User extends Model {
    @PrimaryKey
    @Column
    id: number

    @Length({ min: 1, max: 45 })
    @AllowNull(false)
    @Column
    username: string

    @Length({ min: 1, max: 60 })
    @IsEmail
    @AllowNull(false)
    @Column
    email: string

    @AllowNull(false)
    @Length({ min: 1, max: 450 })
    @Column
    password: string

    @AllowNull(false)
    @Default(0)
    @Column
    confirmed: number
}