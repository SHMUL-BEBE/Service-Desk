import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  findAll() {
    return this.commentRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  findByRequestId(requestId: number) {
    return this.commentRepository.find({
      where: { id_request: requestId },
      order: { created_at: 'DESC' }
    });
  }

  async create(data: any) {
    console.log('Создание комментария с данными:', data);
    
    const newComment = this.commentRepository.create({
      id_request: data.request_id,
      text: data.text,
      created_at: new Date()
    });
    
    console.log('Новый комментарий:', newComment);
    return this.commentRepository.save(newComment);
  }
}