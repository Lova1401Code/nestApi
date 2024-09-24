import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { postId, content } = createCommentDto;
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.prismaService.comment.create({
      data: { content, postId, userId },
    });
    return { data: 'comment created' };
  }

  async delete(userId: number, postId: number, commentId: number) {
    // vérifie si le commentaire existe
    const comment = await this.prismaService.comment.findUnique({
      where: { commentId },
    });
    if (!comment) {
      throw new NotFoundException('comment not found');
    }
    // vérifie si le post de comment existe
    if (comment['postId'] != postId) {
      throw new NotFoundException('post not found');
    }
    // vérifie si c'est vraiment l'user qui a crée le commentaire qui le supprime
    if (comment['userId'] != userId) {
      throw new ForbiddenException('Forbiden');
    }
    await this.prismaService.comment.delete({ where: { commentId } });
    return { data: 'comment deleted succefully' };
  }

  async update(
    userId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const { content, postId } = updateCommentDto;
    //vérifie si le comment existe
    const comment = await this.prismaService.comment.findUnique({
      where: { commentId },
    });
    if (!comment) {
      throw new NotFoundException('comment not found');
    }
    //vérifie si le post match
    if (comment['postId'] != postId) {
      throw new UnauthorizedException('Unauthorization');
    }
    // vérifie si l'user est user connecté
    if (comment['userId'] != userId) {
      throw new ForbiddenException('Forbidden action');
    }
    await this.prismaService.comment.update({
      where: { commentId },
      data: { content },
    });
    return { data: 'comment updated' };
  }
}
