import Puppeteer from "puppeteer";
import { solveCaptcha } from "./helpers/captcha";
import { getLogger } from "./helpers/logger";
import {
  elementExists,
  getElementText,
  getPuppeteerPage,
} from "./helpers/puppeteer";
import { delay } from "./helpers/time";

const logger = getLogger();

export const completeEticket = async () => {
  const [browser, page] = await getPuppeteerPage();

  await page.goto(`https://eticket.migracion.gob.do/Auth/TravelRegister`, {
    waitUntil: "networkidle2",
  });

  // Doesn't always work. You can run the browser non-headless and trigger this yourself.
  // The rest of the form fills up automagically
  // solveCaptcha(page);
  // await delay(5000);

  const $btnSubmit = "#btnSumbit";
  await page.waitForSelector($btnSubmit, { visible: true });
  await page.click($btnSubmit);

  const $applicationId = ".card-title";
  await page.waitForSelector($applicationId);
  const applicationId = getElementText(page, $applicationId);

  // Form values
  await page.type("#permanentAddress", "405 E 42nd St");
  await page.select("#countryRes", "United States of America");
  await page.evaluate((code) => { eval(code); }, `
    $('.modal-trigger')[0].click(); 
    setTimeout(() => { selectCity(136821,'New York','New York City'); }, 500);
  `);
  await page.type('#ZipCode', '10017');
  
  // can be either .entry or .exit
  await page.click('.form-check-label.exit');
  await page.click('.btn-next');
};