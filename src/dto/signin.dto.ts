import { IsEmail, IsNotEmpty } from 'class-validator';
export class SinginDto {
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}
