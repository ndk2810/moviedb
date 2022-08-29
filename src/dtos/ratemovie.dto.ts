import { IsNotEmpty, Max, Min } from "class-validator";

export class RateMovieDTO {
    @IsNotEmpty({ message: "Missing movie ID" })
    movieId: number;

    @IsNotEmpty({ message: "Missing user ID" })
    userId: number;

    @IsNotEmpty({ message: "Missing movie score" })
    @Max(10)
    @Min(0)
    score: number;
}