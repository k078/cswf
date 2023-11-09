import { Test, TestingModule } from '@nestjs/testing';
import { VerzamelingController } from './verzameling.controller';

describe('VerzamelingController', () => {
  let controller: VerzamelingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerzamelingController],
    }).compile();

    controller = module.get<VerzamelingController>(VerzamelingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
