import { Table, Column, Model, PrimaryKey, Length, NotNull, AllowNull } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class Genre extends Model {
    @PrimaryKey
    @Column
    id: number

    @Length({ min: 1, max: 40 })
    @AllowNull(false)
    @Column
    name: string
}