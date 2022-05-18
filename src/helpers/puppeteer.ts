import Puppeteer from 'puppeteer'
import PuppeteerExtra from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

import { settings } from '../settings'
import { getLogger } from './logger'

const pluginStealth = require('puppeteer-extra-plugin-stealth');
const logger = getLogger()

interface PuppeteerInitOptions {
  extra?: boolean
  stealth?: boolean
  authFunc?: (page: Puppeteer.Page) => void
}

type PuppeteerInstanceTuple = [Puppeteer.Browser, Puppeteer.Page]
export const getPuppeteerPage = async (options?: PuppeteerInitOptions): Promise<PuppeteerInstanceTuple> => {
  if (options?.stealth) {
    PuppeteerExtra.use(pluginStealth())
  }

  PuppeteerExtra.use(
    RecaptchaPlugin({
      provider: { 
        id: '2captcha', 
        token: settings.scraper.captchaApi 
      },
      visualFeedback: true
    })
  );

  const instance = options?.extra ? PuppeteerExtra : Puppeteer

  // set browser dimensions
  const [width, height] = [1600, 1200]
  const browser = await instance.launch({
    headless: settings.scraper.headless,
    devtools: false,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      `--window-size=${width},${height}`,
      '--window-position=000,000', 
      '--disable-dev-shm-usage', 
      '--disable-web-security', 
      '--disable-features=IsolateOrigins', 
      ' --disable-site-isolation-trials', 
      // '--proxy-server=socks5://127.0.0.1:9060'
    ],
  });

  const page = await browser.newPage()

  page.setViewport({ width, height })

  page.on('error', (err: Error) => {
    logger.error(err, 'Error (error) triggered from puppeteer session', 'puppeteer')
  });

  page.on('pageerror', (pageErr: Error) => {
    logger.error(pageErr, 'Error (pageErr) triggered from puppeteer session', 'puppeteer')
  })

  // authenticate if needed
  if (options?.authFunc != null) {
    await options.authFunc(page)
  }

  return [browser, page]
}

export const autoScroll = async (page: Puppeteer.Page) => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

export const getElement = async (
  page: Puppeteer.Page,
  $selector: string,
  shouldAwaitSelector?: boolean
) => {
  if (shouldAwaitSelector) {
    await page.waitForSelector($selector, {})
  }

  return await page.$($selector);
}

export const getElementText = async (
  page: Puppeteer.Page,
  $selector: string,
  shouldAwaitSelector?: boolean
) => {
  const element = await getElement(page, $selector, shouldAwaitSelector)
  if (!element) {
    return ''
  }

  return await page.evaluate(element => element.textContent, element);
}

export const getElementHtml = async (
  page: Puppeteer.Page,
  $selector: string,
  shouldAwaitSelector?: boolean
) => {
  const element = await getElement(page, $selector, shouldAwaitSelector)
  if (!element) {
    return ''
  }

  return await page.evaluate(element => element.innerHTML, element);
}

export const elementExists = async (page: Puppeteer.Page, $selector: string) => {
  try {
    await page.waitForSelector($selector, { timeout: 500 })
  } catch (err) {
    return false
  }

  return true
}