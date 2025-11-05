import { Test, TestingModule } from '@nestjs/testing';
import { PerfisController } from './perfis.controller';

describe('PerfisController', () => {
  let controller: PerfisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfisController],
    }).compile();

    controller = module.get<PerfisController>(PerfisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
