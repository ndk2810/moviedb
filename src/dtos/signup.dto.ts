import { IsNotEmpty, MaxLength, IsEmail } from "class-validator";

export class SignUpDTO {
    @IsNotEmpty({ message: "Missing email" })
    @IsEmail()
    @MaxLength(60)
    email: string;

    @IsNotEmpty({ message: "Missing username" })
    @MaxLength(45)
    username: string;

    @IsNotEmpty({ message: "Missing password" })
    @MaxLength(45)
    password: string;
}