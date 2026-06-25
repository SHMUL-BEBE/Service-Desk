import { Test, TestingModule } from '@nestjs/testing';
import { WriteoffsService } from './writeoffs.service';

describe('WriteoffsService', () => {
  let service: WriteoffsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WriteoffsService],
    }).compile();

    service = module.get<WriteoffsService>(WriteoffsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
