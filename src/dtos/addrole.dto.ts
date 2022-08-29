import { IsNotEmpty, MaxLength } from "class-validator";

export class AddRoleDTO {
    @IsNotEmpty({ message: "Missing movie ID" })
    movieId: number;

    @IsNotEmpty({ message: "Missing actor ID" })
    actorId: number;

    @IsNotEmpty({ message: "Missing role name" })
    @MaxLength(45)
    role: string;
}