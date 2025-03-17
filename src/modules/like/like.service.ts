import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from './like.entity';
import { RedisCacheService } from '../../cache/redis-cache.service';
import { Post } from '../post/post.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private likeRepository: Repository<LikeEntity>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async likePost(userId: string, postId: string): Promise<string> {
    const cacheKey = `like:${userId}:${postId}`;

    // Check if the user has liked the post within the last 30s
    const isLikedRecently = await this.redisCacheService.get(cacheKey);
    if (isLikedRecently) {
      throw new BadRequestException(
        'You have already liked this post recently',
      );
    }

    const like = this.likeRepository.create({ userId, postId });
    await this.likeRepository.save(like);

    await this.redisCacheService.set(cacheKey, '1');

    const likesCountKey = `likes_count:${postId}`;
    const currentLikes = await this.redisCacheService.get(likesCountKey);
    const newLikesCount = currentLikes ? parseInt(currentLikes) + 1 : 1;
    await this.redisCacheService.set(likesCountKey, newLikesCount.toString());
    await this.redisCacheService.delCacheWhereKeyLike('posts:*');
    await this.redisCacheService.delCacheWhereKeyLike('likes_count:*');

    return 'Liked successfully';
  }

  async unlikePost(userId: string, postId: string): Promise<string> {
    const like = await this.likeRepository.findOne({
      where: { userId, postId },
    });

    if (!like) {
      throw new BadRequestException('You have not liked this post');
    }

    await this.likeRepository.remove(like);

    await this.redisCacheService.delCacheWhereKeyLike(
      `like:${userId}:${postId}`,
    );

    const likesCountKey = `likes_count:${postId}`;
    const currentLikes = await this.redisCacheService.get(likesCountKey);
    if (currentLikes) {
      const newLikesCount = Math.max(0, parseInt(currentLikes) - 1);
      await this.redisCacheService.set(likesCountKey, newLikesCount.toString());
    }

    await this.redisCacheService.delCacheWhereKeyLike('posts:*');
    await this.redisCacheService.delCacheWhereKeyLike('likes_count:*');

    return 'Unliked successfully';
  }

  async getLikesCount(postId: string): Promise<number> {
    const likesCountKey = `likes_count:${postId}`;
    const cachedLikes = await this.redisCacheService.get(likesCountKey);

    if (cachedLikes) {
      return parseInt(cachedLikes);
    }

    // if not found in cache, get from database
    const likesCount = await this.likeRepository.count({ where: { postId } });
    await this.redisCacheService.set(likesCountKey, likesCount.toString(), 300); // cache for 5 minutes

    return likesCount;
  }

  async getUserLikes(userId: string): Promise<
    {
      postId: Post['id'];
    }[]
  > {
    const likesCountKey = `likes_count:${userId}`;
    const cachedLikes = await this.redisCacheService.get(likesCountKey);
    if (cachedLikes) {
      return JSON.parse(cachedLikes) as { postId: Post['id'] }[];
    }
    const likes = await this.likeRepository.find({
      where: { userId },
    });
    const result = likes.map((like) => ({ postId: Number(like.postId) }));
    await this.redisCacheService.set(
      likesCountKey,
      JSON.stringify(result),
      300,
    ); // cache for 5 minutes

    return result;
  }
}
