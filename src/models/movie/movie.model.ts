import { Table, Column, Model, PrimaryKey, Max, Length, NotNull, Default, IsDecimal, AllowNull } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class Movie extends Model {
    @PrimaryKey
    @Column
    id: number

    @Length({ max: 75 })
    @AllowNull(false)
    @Column
    title: string

    @Default("No overview available")
    @Column
    overview: string

    @Length({ max: 45 })
    @Column
    poster: string

    @Max(10.0)
    @Default(0.0)
    @IsDecimal
    @Column
    score: number

    @Column
    views: number
}