import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from '../user/user.entity';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({
    schema: {
      properties: { title: { type: 'string' }, content: { type: 'string' } },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  async createPost(
    @Req() req: { user: User },
    @Body() body: { title: string; content: string },
  ) {
    return this.postService.createPost(body.title, body.content, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'pageSize', required: false, type: 'number' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  async getAllPosts(@Query('page') page = 1, @Query('pageSize') limit = 10) {
    return this.postService.getAllPosts(page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search posts by title' })
  @ApiQuery({ name: 'title', required: true, type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Return posts matching the search criteria.',
  })
  async searchPosts(@Query('title') title: string): Promise<PostEntity[]> {
    return this.postService.searchPostsByTitle(title);
  }
}
