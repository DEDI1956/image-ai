const puppeteer = require('puppeteer');

async function createGmailAccount(firstName, password) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

  try {
    await page.goto('https://accounts.google.com/SignUp');

    await page.waitForSelector('input[name="firstName"]');
    await page.type('input[name="firstName"]', firstName);

    // Google might ask for last name, let's just use the first name again
    await page.keyboard.press('Tab');
    await page.keyboard.type(firstName);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');


    await page.keyboard.press('Tab');
    await page.keyboard.type('1');
    await page.keyboard.press('Tab');
    await page.keyboard.type('January');
    await page.keyboard.press('Tab');
    await page.keyboard.type('2000');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Male');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');

    await navigationPromise;

    await page.waitForSelector('input[name="Username"]');
    const username = `${firstName}${Math.floor(Math.random() * 10000)}`;
    await page.type('input[name="Username"]', username);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');

    await navigationPromise;

    await page.waitForSelector('input[name="Passwd"]');
    await page.type('input[name="Passwd"]', password);
    await page.type('input[name="ConfirmPasswd"]', password);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');

    await navigationPromise;

    // Here, Google will likely ask for phone number verification.
    // We will try to skip it, but it may not be possible.
    // This is the most likely point of failure.

    // We'll check for a "skip" button, if it exists.
    const skipButton = await page.$x("//button[contains(., 'Skip')]");
    if (skipButton.length > 0) {
      await skipButton[0].click();
      await navigationPromise;
    }

    // If we are at the privacy and terms page, we are almost there.
    await page.waitForSelector('button[jsname="LgbsSe"]');
    await page.click('button[jsname="LgbsSe"]');

    await navigationPromise;

    await browser.close();

    return { success: true, email: `${username}@gmail.com` };
  } catch (error) {
    await browser.close();
    return { success: false, error: error.message };
  }
}

module.exports = { createGmailAccount };
