import { TestBed } from '@angular/core/testing';

import { GitgraphService } from './gitgraph.service';

describe('GitgraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GitgraphService = TestBed.get(GitgraphService);
    expect(service).toBeTruthy();
  });
});
