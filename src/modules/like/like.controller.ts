import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { LikeDto } from './dto/like.dto';
import { UnlikeDto } from './dto/unlike.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({
    Throttle: {
      limit: 5,
      ttl: 30,
    },
  }) // Limit 5 requests per 30 seconds
  @Post()
  @ApiOperation({ summary: 'Like a post' })
  @ApiBody({ type: LikeDto, schema: { example: { postId: '1' } } })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully liked.',
  })
  @ApiBearerAuth()
  async like(
    @Req()
    req: {
      user: {
        userId: string;
        email: string;
      };
    },
    @Body() likeDto: LikeDto,
  ) {
    return this.likesService.likePost(req.user.userId, likeDto.postId);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({
    Throttle: {
      limit: 5,
      ttl: 30,
    },
  })
  @Delete()
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiBody({ type: UnlikeDto })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully unliked.',
  })
  @ApiBearerAuth()
  async unlike(
    @Req()
    req: {
      user: {
        userId: string;
        email: string;
      };
    },
    @Body() unlikeDto: UnlikeDto,
  ) {
    return this.likesService.unlikePost(req.user.userId, unlikeDto.postId);
  }

  @Post(':postId/count')
  @ApiOperation({ summary: 'Get like count for a post' })
  @ApiParam({ name: 'postId', required: true, description: 'ID of the post' })
  @ApiResponse({
    status: 200,
    description: 'Return the like count for the post.',
  })
  async getLikeCount(@Param('postId') postId: string) {
    return await this.likesService.getLikesCount(postId);
  }
}
