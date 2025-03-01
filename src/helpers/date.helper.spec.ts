import { Test, TestingModule } from '@nestjs/testing';
import { DateHelper } from './date.helper';

describe('DateHelper', () => {
  let provider: DateHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateHelper],
    }).compile();

    provider = module.get<DateHelper>(DateHelper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
