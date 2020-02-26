import { AuthorInitialsPipe } from './author-initials.pipe';

describe('AuthorInitialsPipe', () => {
  it('create an instance', () => {
    const pipe = new AuthorInitialsPipe();
    expect(pipe).toBeTruthy();
  });
});
