import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';


@ApiTags('users')
@Controller('users')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;
   

  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    // Imposta role default a 'admin' o 'staff' se non fornito
    const role = body.role ?? 'admin';
    return this.userService.signup({ ...body, role });
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return this.userService.login(body);
  }
}