
export type EnvironmentName = 'development' | 'staging' | 'production'

interface SettingsSchema {
  scraper: {
    headless: boolean
    captchaApi: string
  }
}

export const settings: SettingsSchema = {
  scraper: {
    headless: false,
    captchaApi: process.env.SCRAPER_CAPTCHA_API!
  }
}