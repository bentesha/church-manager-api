import { Test, TestingModule } from '@nestjs/testing';
import { FellowshipController } from './fellowship.controller';

describe('FellowshipController', () => {
  let controller: FellowshipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FellowshipController],
    }).compile();

    controller = module.get<FellowshipController>(FellowshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
