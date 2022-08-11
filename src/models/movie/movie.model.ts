import { Table, Column, Model, PrimaryKey, Max, Length, NotNull, Default, IsDecimal } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class Movie extends Model {
    @PrimaryKey
    @Column
    id: number
    
    @Column
    genreId: number

    @Length({ min: 1, max: 75 })
    @NotNull
    @Column
    title: string

    @Default("No overview available")
    @Column
    overview: string

    @Max(10.0)
    @Default(0.0)
    @IsDecimal
    @Column
    score: number

    @Column
    views: number
}