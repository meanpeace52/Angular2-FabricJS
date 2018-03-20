import { AgentCloudPage } from './app.po';

describe('agent-cloud App', function() {
  let page: AgentCloudPage;

  beforeEach(() => {
    page = new AgentCloudPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
