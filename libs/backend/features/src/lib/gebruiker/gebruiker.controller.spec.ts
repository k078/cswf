import { Test, TestingModule } from '@nestjs/testing';
import { GebruikerController } from './gebruiker.controller';
import { GebruikerService } from './gebruiker.service';

describe('GebruikerController', () => {
  let controller: GebruikerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GebruikerController],
      providers: [GebruikerService],
    }).compile();


    controller = module.get<GebruikerController>(GebruikerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Voeg hier je andere testcases toe

});
