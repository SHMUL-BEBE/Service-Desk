// src/clients/clients.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from './client.entity';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  findAll() {
    return this.clientRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id_client: id }
    });
    
    if (!client) {
      throw new NotFoundException(`Клиент с ID ${id} не найден`);
    }
    
    return client;
  }

  async update(id: number, body: Partial<Client>): Promise<Client> {
    await this.findOne(id);
    await this.clientRepository.update(id, body);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Клиент с ID ${id} не найден`);
    }
  }

  async create(data: Partial<Client>): Promise<Client> {
    const existing = await this.clientRepository.findOne({
      where: [
        { login: data.login },
        { email: data.email }
      ]
    });

    if (existing) {
      throw new ConflictException('Пользователь с таким логином или email уже существует');
    }

    const newClient = this.clientRepository.create(data);
    return this.clientRepository.save(newClient);
  }

  async login(login: string, password: string) {
    const client = await this.clientRepository.findOne({
      where: {
        login,
        password
      }
    });

    if (!client) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return {
      id: client.id_client,
      login: client.login,
      fullName: client.full_name,
      role: 'CLIENT'
    };
  }
}