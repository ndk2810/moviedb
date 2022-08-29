import { IsNotEmpty, MaxLength } from "class-validator";

export class AddGenreToMovieDTO {
    @IsNotEmpty({ message: "Missing movie ID" })
    movieId: number;

    @IsNotEmpty({ message: "Missing genre ID" })
    genreId: number;
}