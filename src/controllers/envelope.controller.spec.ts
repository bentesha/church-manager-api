import { Test, TestingModule } from '@nestjs/testing';
import { EnvelopeController } from './envelope.controller';

describe('EnvelopeController', () => {
  let controller: EnvelopeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvelopeController],
    }).compile();

    controller = module.get<EnvelopeController>(EnvelopeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
