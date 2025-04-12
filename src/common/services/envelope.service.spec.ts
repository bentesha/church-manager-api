import { Test, TestingModule } from '@nestjs/testing';
import { EnvelopeService } from './envelope.service';

describe('EnvelopeService', () => {
  let service: EnvelopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvelopeService],
    }).compile();

    service = module.get<EnvelopeService>(EnvelopeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
