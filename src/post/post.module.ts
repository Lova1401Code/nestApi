import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtStrategy } from 'src/dto/strategy.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
})
export class PostModule {}
