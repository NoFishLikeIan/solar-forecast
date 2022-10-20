import puppeteer, { Target } from 'puppeteer';

// Environment
import dotenv from 'dotenv';
dotenv.config({ path: ".env" });

import { env } from 'process';

const { TARGET, PASSWORD, EMAIL } = env;

const CLICK_DELAY = 2_000;
const TYPE_DELAY = 200;

const justWait = (seconds:number) => new Promise(r => setTimeout(r, seconds * 1000));

(async () => {
    
    const areAllEnvDefined = 
        TARGET != undefined && 
        EMAIL != undefined && 
        PASSWORD != undefined

    if (areAllEnvDefined) {
        const url = new URL('/mijn/inloggen', TARGET)
        
        const browser = await puppeteer.launch({
            headless: false
        });
            
        const page = await browser.newPage()
        await page.goto(url.toString(), { waitUntil: "networkidle2" })

        await page.click(
            "#CybotCookiebotDialogBodyLevelButtonCustomize",
            { delay: CLICK_DELAY }
        )

        await page.click(
            "#CybotCookiebotDialogBodyButtonDecline",
            { delay: CLICK_DELAY }
        )

        await page.focus('#username')
        await page.keyboard.type(EMAIL, { delay: TYPE_DELAY })

        await page.focus("#password")
        await page.keyboard.type(PASSWORD, { delay: TYPE_DELAY })
        await page.keyboard.press('Enter')

        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle2" }),
            page.waitForNavigation({ waitUntil: "load" }),
            justWait(10)
        ])
    
        await browser.close()
    } else { throw new Error("You need to set all URL, EMAIL, and PASSWORD in .env") }
})();
