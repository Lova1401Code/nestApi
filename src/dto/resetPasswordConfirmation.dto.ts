import { IsNotEmpty, IsEmail } from 'class-validator';
export class ResetPasswordConfirmationDto {
  @IsNotEmpty()
  readonly password: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly code: string;
}
