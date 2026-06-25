import { Test, TestingModule } from '@nestjs/testing';
import { WriteoffsController } from './writeoffs.controller';

describe('WriteoffsController', () => {
  let controller: WriteoffsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WriteoffsController],
    }).compile();

    controller = module.get<WriteoffsController>(WriteoffsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
