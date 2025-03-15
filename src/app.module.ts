import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerConfig } from './common/throttler.config';
import { RedisCacheModule } from './cache/redis-cache.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { LikesModule } from './modules/like/like.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    LikesModule,
    ThrottlerConfig,
    DatabaseModule,
    RedisCacheModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
