import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { RedisCacheModule } from 'src/cache/redis-cache.module';
import { UserModule } from '../user/user.module';
import { LikesModule } from '../like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    AuthModule,
    UserModule,
    RedisCacheModule,
    LikesModule,
  ],
  controllers: [PostController],
  providers: [PostService, JwtService],
  exports: [PostService],
})
export class PostModule {}
