// Validation des champs
import { IsEmail, IsNotEmpty } from 'class-validator';
export class SignupDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly password: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
