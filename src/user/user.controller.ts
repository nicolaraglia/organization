import { Controller, Post, Body, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';


@Controller('users')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;
   

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    // Imposta role default a 'admin' o 'staff' se non fornito
    const role = body.role ?? 'admin';
    return this.userService.signup({ ...body, role });
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return this.userService.login(body);
  }
}