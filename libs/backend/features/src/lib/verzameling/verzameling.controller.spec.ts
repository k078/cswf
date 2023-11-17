import { Test, TestingModule } from '@nestjs/testing';
import { VerzamelingController } from './verzameling.controller';
import { VerzamelingService } from './verzameling.service';

describe('VerzamelingController', () => {
  let controller: VerzamelingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerzamelingController],
      providers: [VerzamelingService],
    }).compile();


    controller = module.get<VerzamelingController>(VerzamelingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Voeg hier je andere testcases toe

});
