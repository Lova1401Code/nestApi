import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
  // injecter prisma
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPostDto: CreatePostDto, userId: number) {
    const { body, title } = createPostDto;
    await this.prismaService.post.create({ data: { body, title, userId } });
    return { data: 'post created' };
  }

  //   récupération des utilisateurs
  async getAll() {
    const posts = await this.prismaService.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            password: false,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                email: true,
                password: false,
              },
            },
          },
        },
      },
    });
    return posts;
  }
  //   suppression Post
  async delete(postId: number, userId: number) {
    // vérifier si le post existe
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    // vérifier si c'est le créateur qui supprime
    if (post['userId'] != userId) {
      throw new ForbiddenException('Forbiden action');
    }
    await this.prismaService.post.delete({ where: { postId } });

    return { data: 'post deleted' };
  }

  //Modification post
  async update(postId: number, userId: number, updatePostDto: UpdatePostDto) {
    //vérifie si le post existe
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    //  vérifie si c'est le créateur qui veut modifier le post
    if (post['userId'] != userId) {
      throw new ForbiddenException('forbiden');
    }
    await this.prismaService.post.update({
      where: { postId },
      data: { ...updatePostDto },
    });
    return { data: 'post modifié' };
  }
}
