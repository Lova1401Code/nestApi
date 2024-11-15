import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type User = {
  id: number;
  nom: string;
};
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Fonction pour récupérer tous les utilisateurs
  async getAllUsers() {
    return this.prisma.user.findMany(); // Utilisation de Prisma pour récupérer tous les utilisateurs
  }
}
