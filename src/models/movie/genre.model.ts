import { Table, Column, Model, PrimaryKey, Length, NotNull, AllowNull, AutoIncrement } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class Genre extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @Length({ min: 1, max: 40 })
    @AllowNull(false)
    @Column
    name: string
}