import { Injectable } from '@nestjs/common';

type User = {
  id: number;
  nom: string;
};
@Injectable()
export class UserService {
  getUsers(): User[] {
    return [
      {
        id: 1,
        nom: 'Lova',
      },
    ];
  }
}
