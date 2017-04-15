import { PassportPage } from './app.po';

describe('passport App', () => {
  let page: PassportPage;

  beforeEach(() => {
    page = new PassportPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
