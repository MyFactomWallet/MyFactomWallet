const puppeteer = require('puppeteer');
const { FactomCli } = require('factom/dist/factom');

const isDebugging = () => {
	const debugging_mode = {
		headless: true,
		slowMo: 250,
		ignoreHTTPSErrors: true,
		args: ['--ignore-certificate-errors'],
	};
	return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
};

let browser;
let page;
beforeAll(async () => {
	browser = await puppeteer.launch(isDebugging());
	page = await browser.newPage();
	await page.goto('https://dev.myfactomwallet.com:3000/');
	page.setViewport({ width: 500, height: 2400 });
});

describe('on page load', () => {
	test('h1 loads correctly', async () => {
		const html = await page.$eval('.MuiButton-label', (e) => e.innerHTML);
		expect(html).toBe('Wallet');
	}, 16000);
});

afterAll(() => {
	if (isDebugging()) {
		browser.close();
	}
});
