import { Test, TestingModule } from '@nestjs/testing';
import { FellowshipService } from './fellowship.service';

describe('FellowshipService', () => {
  let service: FellowshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FellowshipService],
    }).compile();

    service = module.get<FellowshipService>(FellowshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
