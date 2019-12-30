import { Test, TestingModule } from '@nestjs/testing';
import { GitGateway } from './git.gateway';

describe('GitGateway', () => {
  let gateway: GitGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GitGateway],
    }).compile();

    gateway = module.get<GitGateway>(GitGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
