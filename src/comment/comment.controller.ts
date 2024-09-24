import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Request } from 'express';
import { CreateCommentDto } from './dto/createComment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('commentaire')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Req() request: Request, @Body() createCommentDto: CreateCommentDto) {
    const userId = request.user['userId'];
    return this.commentService.create(userId, createCommentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(
    @Req() request: Request,
    @Param('id', ParseIntPipe) commentId: number,
    @Body('postId') postId: number,
  ) {
    const userId: number = request.user['userId'];
    return this.commentService.delete(userId, postId, commentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId = request.user['userId'];
    return this.commentService.update(userId, commentId, updateCommentDto);
  }
}
