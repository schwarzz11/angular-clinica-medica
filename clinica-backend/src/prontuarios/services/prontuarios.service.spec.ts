import { Test, TestingModule } from '@nestjs/testing';
import { ProntuariosService } from './prontuarios.service';

describe('ProntuariosService', () => {
  let service: ProntuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProntuariosService],
    }).compile();

    service = module.get<ProntuariosService>(ProntuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
