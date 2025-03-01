import { Test, TestingModule } from '@nestjs/testing';
import { IdHelper } from './id.helper';

describe('IdHelper', () => {
  let provider: IdHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdHelper],
    }).compile();

    provider = module.get<IdHelper>(IdHelper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
