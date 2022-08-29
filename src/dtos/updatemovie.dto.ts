import { IsNotEmpty, MaxLength } from "class-validator";

export class UpdateMovieDTO {
    @IsNotEmpty({ message: "Missing movie ID" })
    id: number;

    @IsNotEmpty({ message: "Missing movie title" })
    title: string;
}