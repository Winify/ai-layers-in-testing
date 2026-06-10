export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: ['./test/specs/**/*.ts'],

    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            // args: ['--headless=new'],
        },
    }],

    services: [
        ['agent', {
            provider: 'openai',
            providerUrl: process.env.LLM_PROVIDER_URL || 'http://localhost:1234',
            model: process.env.LLM_MODEL || 'qwen/qwen3.5-4b',
            token: process.env.OPENAI_API_KEY || 'lm-studio-no-auth',
            maxActions: 2,
            timeout: 30000,
            maxRetries: 2,
            maxOutputTokens: 1024,
            toonFormat: 'yaml-like',
        }],
    ],

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    logLevel: 'error',
};
