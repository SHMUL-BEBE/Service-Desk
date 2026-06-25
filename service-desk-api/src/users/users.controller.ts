import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UnauthorizedException
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }

  @Post('register')
  register(@Body() body: any) {

    return this.usersService.create({
      login: body.login,
      password: body.password,
      role: 'CLIENT',
      created_at: new Date()
    });
  }

  @Post('login')
  async login(@Body() body: any) {

    const user = await this.usersService.findByLogin(
      body.login
    );

    if (!user) {
      throw new UnauthorizedException(
        'Неверный логин'
      );
    }

    if (user.password !== body.password) {
      throw new UnauthorizedException(
        'Неверный пароль'
      );
    }

    return user;
  }
}