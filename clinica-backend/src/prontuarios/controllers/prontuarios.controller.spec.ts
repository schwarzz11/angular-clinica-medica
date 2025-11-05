import { Test, TestingModule } from '@nestjs/testing';
import { ProntuariosController } from './prontuarios.controller';

describe('ProntuariosController', () => {
  let controller: ProntuariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProntuariosController],
    }).compile();

    controller = module.get<ProntuariosController>(ProntuariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
