import { Table, Column, Model, PrimaryKey, Max, Length, Default, IsDecimal, AllowNull, AutoIncrement } from 'sequelize-typescript'

@Table({
    timestamps: false
})
export class Movie extends Model {
    @PrimaryKey
    @AutoIncrement
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

    @Default(0)
    @Column
    views: number
    
    @Default(0)
    @Column
    isDeleted: number
}