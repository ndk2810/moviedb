import { Table, Column, Model, PrimaryKey, Length, NotNull, IsEmail } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class User extends Model {
    @PrimaryKey
    @Column
    id: number

    @Length({ min: 1, max: 45 })
    @NotNull
    @Column
    username: string

    @Length({ min: 1, max: 60 })
    @IsEmail
    @NotNull
    @Column
    email: string

    @NotNull
    @Length({ min: 1, max: 45 })
    @Column
    password: string

    @NotNull
    @Column
    confirmed: number
}