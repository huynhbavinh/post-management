import { Injectable } from '@nestjs/common';
import { Post as PostEntity } from './post.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisCacheService } from 'src/cache/redis-cache.service';
import { LikeService } from '../like/like.service';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly redisCacheService: RedisCacheService,
    private readonly likeService: LikeService,
  ) {}

  async createPost(
    title: string,
    content: string,
    user: User,
  ): Promise<PostEntity> {
    const post = this.postRepository.create({
      title,
      content,
      createdBy: user,
    });
    await this.redisCacheService.delCacheWhereKeyLike('posts:*');
    return this.postRepository.save(post);
  }

  async getAllPosts(
    page: number,
    limit: number,
  ): Promise<{
    data: PostEntity[];
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    const cachedData = await this.redisCacheService.get(
      `posts:${page}:${limit}`,
    );
    if (cachedData) {
      return JSON.parse(cachedData) as {
        data: PostEntity[];
        total: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
      };
    }
    const [data, total] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['createdBy'],
      select: {
        createdBy: {
          id: true,
          email: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
    for (const post of data) {
      post['likesCount'] = await this.likeService.getLikesCount(
        post.id.toString(),
      );
    }
    const totalPages = Math.ceil(total / limit);
    const results = {
      data,
      total,
      totalPages,
      currentPage: Number(page),
      pageSize: Number(limit),
    };
    await this.redisCacheService.set(
      `posts:${page}:${limit}`,
      JSON.stringify(results),
      500,
    );
    return results;
  }

  async searchPostsByTitle(title: string): Promise<PostEntity[]> {
    return this.postRepository.find({ where: { title: ILike(`%${title}%`) } });
  }
}
