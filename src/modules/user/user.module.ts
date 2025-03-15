import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisCacheService } from 'src/cache/redis-cache.service';
import { AppLoggerService } from 'src/common/logger.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [
    UserService,
    UserRepository,
    RedisCacheService,
    AppLoggerService,
    AuthService,
    JwtService,
  ],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
