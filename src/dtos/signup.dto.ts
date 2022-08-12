import { IsNotEmpty, MaxLength, IsEmail, MinLength } from "class-validator";

export class SignUpDTO {
    @IsNotEmpty({ message: "Missing email" })
    @IsEmail()
    @MinLength(5)
    @MaxLength(60)
    email: string;

    @IsNotEmpty({ message: "Missing username" })
    @MaxLength(45)
    username: string;

    @IsNotEmpty({ message: "Missing password" })
    @MaxLength(45)
    @MinLength(6)
    password: string;
}