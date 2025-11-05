import { Test, TestingModule } from '@nestjs/testing';
import { ConveniosService } from './convenios.service';

describe('ConveniosService', () => {
  let service: ConveniosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConveniosService],
    }).compile();

    service = module.get<ConveniosService>(ConveniosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
