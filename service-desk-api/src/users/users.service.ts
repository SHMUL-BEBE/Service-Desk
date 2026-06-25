import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({
      id_user: id,
    });
  }

  findByLogin(login: string) {
    return this.userRepository.findOneBy({
      login,
    });
  }

  create(data: Partial<User>) {
    return this.userRepository.save(data);
  }

  delete(id: number) {
    return this.userRepository.delete(id);
  }
}