import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreatePostDto {
  // on met les champs optionnels pour que l'utilisateur peut changer ce qu'il veut
  @IsNotEmpty()
  @IsOptional()
  readonly title?: string;
  @IsNotEmpty()
  @IsOptional()
  readonly body?: string;
}
