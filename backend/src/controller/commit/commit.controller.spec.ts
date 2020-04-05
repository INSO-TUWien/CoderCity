import { Test, TestingModule } from '@nestjs/testing';
import { CommitController } from './commit.controller';

describe('Commit Controller', () => {
  let controller: CommitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitController],
    }).compile();

    controller = module.get<CommitController>(CommitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
