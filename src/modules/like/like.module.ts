import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './like.entity';
import { LikeService } from './like.service';
import { LikesController } from './like.controller';
import { RedisCacheService } from '../../cache/redis-cache.service';
import { AppLoggerService } from '../../common/logger.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity]), AuthModule],
  controllers: [LikesController],
  providers: [LikeService, RedisCacheService, AppLoggerService],
  exports: [LikeService],
})
export class LikesModule {}
