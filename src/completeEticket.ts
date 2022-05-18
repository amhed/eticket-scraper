import Puppeteer from "puppeteer";
import { getLogger } from "./helpers/logger";
import { elementExists, getPuppeteerPage } from "./helpers/puppeteer";
import { delay } from "./helpers/time";

const logger = getLogger();

export const completeEticket = async () => {
  const [browser, page] = await getPuppeteerPage();

  await page.goto(`https://eticket.migracion.gob.do/Auth/TravelRegister`, {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector(".recaptcha-checkbox-border");
  await page.click(".recaptcha-checkbox-border");

  // const $searchBox = '#address_unified_search_address'
  // await page.waitForSelector($searchBox)
  // await page.click($searchBox)
  // await page.type($searchBox, address)
  // await delay()

  // const $houseType = '#address_unified_search_building_type'
  // await page.select($houseType, 'House')
  // await delay()

  // const $dropdown = '#address_unified_search_bed_style'
  // await page.select($dropdown, '1-4SUMMARY')
  // await delay()
  // await page.$eval('#address_unified_search_form', form => (form as HTMLFormElement).submit());

  // await delay(500)
  // await page.waitForSelector('table')

  // browser.close();
};

//TODO: Connect this to captcha check
const getUrlWithCaptchaCheck = async (
  page: Puppeteer.Page,
  url: string
): Promise<boolean> => {
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  const captchaPresent = await elementExists(page, "#px-captcha");
  if (captchaPresent) {
    // Found a captcha. Try to solve it
    logger.log("Found captcha... attempting to solve");
    const captchaResult = await (page as any).solveRecaptchas();
    await page.waitForNavigation();

    // Let callsite know captcha occurred
    return false;
  }

  logger.log("No captcha found. Continuing");
  return true;
};
