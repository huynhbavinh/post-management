import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RedisCacheService } from '../../cache/redis-cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const cacheKey = `user:${email}`;
    const cachedUser = await this.redisCacheService.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser) as unknown as User;
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      await this.redisCacheService.set(cacheKey, JSON.stringify(user), 60);
    }

    return user;
  }

  async createUser(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return await this.userRepository.save(user);
  }
}
