import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsIn(["user", "admin"])
  role?: "user" | "admin";
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
