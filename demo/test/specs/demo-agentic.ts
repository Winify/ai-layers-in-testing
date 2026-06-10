import {browser, expect} from '@wdio/globals';

describe('Runtime Agentic Testing', () => {

  beforeEach(() => console.log('===='))

  // ---------------------------------------------------------------
  // Chunk 2a: First agent call — navigate via semantic intent
  // ---------------------------------------------------------------
  it.skip('should use agent to navigate to login page', async () => {
    await browser.url('https://the-internet.herokuapp.com');

    // Traditional: verify we're on the right page
    const heading = await $('h1.heading');
    await expect(heading).toHaveText('Welcome to the-internet');
    console.log('Traditional assertion: heading verified');

    // Agentic: find and click a link by semantic meaning
    console.log('\nCalling browser.agent("click the Form Authentication link")...');
    const result = await browser.agent('click the "Form Authentication" link');

    console.log('   Agent response:', JSON.stringify(result, null, 2));
    console.log('   Action:', result[0].type);
    console.log('   Selector:', result[0].target);

    // Verify we navigated correctly
    const loginHeading = await $('h2');
    await expect(loginHeading).toHaveText('Login Page');
    console.log('Agent successfully clicked the link\n');
  });

  // ---------------------------------------------------------------
  // Chunk 2b: Hybrid pattern — traditional for stable, agent for flaky
  // ---------------------------------------------------------------
  it.skip('should login using hybrid traditional + agentic approach', async () => {
    await browser.url('https://the-internet.herokuapp.com/login');

    const formAction = await browser.agent('fill from with username / password: tomsmith / SuperSecretPassword!');
    console.log('   Agent response:', JSON.stringify(formAction, null, 2));

    // AGENTIC: submit button — imagine its class is dynamic / A/B tested
    console.log('\nAgent: locating and clicking submit button...');
    const clickResult = await browser.agent('click the button that submits the login form');
    console.log('   Agent used selector:', clickResult[0].target);

    // TRADITIONAL: verify result with known assertion
    await expect($('.flash.success')).toHaveText(
      expect.stringContaining('You logged into a secure area!')
    );
    console.log('Login successful — hybrid approach\n');
  });

  // ---------------------------------------------------------------
  // Chunk 2c: Self-healing — agent adapts when selectors change
  // ---------------------------------------------------------------
  it.skip('should self-heal when selectors change', async () => {
    // Assume we're logged in from previous test
    await browser.url('https://the-internet.herokuapp.com/secure');

    console.log('Scenario: logout button CSS class changed in latest deploy');
    console.log('   Old class >>> a.button.secondary.radius');
    console.log('   New class >>> a.button.alert.radius');
    console.log('   Traditional selector would FAIL\n');

    console.log('Agent: observing DOM, adapting...');
    const logoutResult = await browser.agent(
      'click the logout button'  // semantic intent, not CSS-class-based
    );

    console.log('   Agent found element with selector:', JSON.stringify(logoutResult[0].target));
    console.log('   Clicked successfully — zero test code changes\n');

    // Verify we're back on login page
    await expect($('h2')).toHaveText('Login Page');
    console.log('Logout successful — the test healed itself');
  });
});
