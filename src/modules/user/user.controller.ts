import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  Get,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { AuthService } from '../../auth/auth.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { User } from './user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
  })
  async register(@Body() body: { email: string; password: string }) {
    await this.userService.createUser(body.email, body.password);
    return { message: 'User has been successfully registered.' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    schema: {
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
  })
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const token = this.authService.login(user);
    if (!token.access_token) {
      return { message: 'Invalid credentials' };
    }
    // use cookie to store the token, and setup httpOnly and sameSite to prevent XSS attacks
    res.cookie('token', token, {
      httpOnly: true, // Set to `true` if running HTTPS
      sameSite: 'lax', // Or 'none' if frontend and backend are on different domains
      path: '/',
    });
    console.log('User token', token.access_token); // Log the token to the console for demo
    res.status(200).send({ message: 'User has been successfully logged in.' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Return the profile of the logged-in user.',
  })
  @ApiBearerAuth()
  getProfile(@Request() req: { user: User }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged out.',
  })
  @ApiBearerAuth()
  logout(@Res() res: Response) {
    res.clearCookie('token', { path: '/' });
    res.send({ message: 'User has been successfully logged out.' });
  }
}
