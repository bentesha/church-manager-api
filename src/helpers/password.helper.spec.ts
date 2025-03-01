import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHelper } from './password.helper';

describe('PasswordHelper', () => {
  let provider: PasswordHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHelper],
    }).compile();

    provider = module.get<PasswordHelper>(PasswordHelper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
