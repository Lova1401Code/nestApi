import {
  Body,
  Param,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    // recuperer l'id de l'user connecté with request d'express
    const userId: number = request.user['userId'];
    return this.postService.create(createPostDto, userId);
  }

  @Get()
  getAll() {
    return this.postService.getAll();
  }

  @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  getPost(@Param('id', ParseIntPipe) postId: number) {
    return this.postService.getPost(postId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) postId: number, @Req() request: Request) {
    const userId: number = request.user['userId'];
    return this.postService.delete(postId, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  update(
    @Param('id', ParseIntPipe) postId: number,
    @Req() request: Request,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId: number = request.user['userId'];
    return this.postService.update(postId, userId, updatePostDto);
  }
}
