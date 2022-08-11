import { Table, Column, Model, PrimaryKey, Length, NotNull } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class Genre extends Model {
    @PrimaryKey
    @Column
    id: number

    @Length({ min: 1, max: 40 })
    @NotNull
    @Column
    name: string
}