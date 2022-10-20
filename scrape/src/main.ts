import puppeteer, { Target } from 'puppeteer';

// Environment
import dotenv from 'dotenv';
dotenv.config({ path: ".env" });

import { env } from 'process';

const { TARGET, PASSWORD, EMAIL } = env;

const CLICK_DELAY = 2_000;
const TYPE_DELAY = 100;

const justWait = (seconds:number) => new Promise(r => setTimeout(r, seconds * 1000));

(async () => {
    
    const areAllEnvDefined = 
        TARGET != undefined && 
        EMAIL != undefined && 
        PASSWORD != undefined

    if (areAllEnvDefined) {
        const loginUrl = new URL('/mijn/inloggen', TARGET)
        
        const browser = await puppeteer.launch({
            headless: false
        });
            
        const page = await browser.newPage()

        // Login
        await page.goto(loginUrl.toString(), { waitUntil: "networkidle2" })

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
            justWait(5)
        ])

        // Access consumption data
        const consumptionUrl = new URL("/mijn/verbruiksoverzicht", TARGET)
        
        const [response] = await Promise.all([
            page.goto(consumptionUrl.toString(), { waitUntil: 'networkidle2' }),
            justWait(10),
            page.select(".h-full.w-full.rounded.py-2.pl-3.pr-14", "days"),
            // page.waitForResponse(response => response.url())
        ])


        // Done
        await browser.close()

    } else { throw new Error("You need to set all URL, EMAIL, and PASSWORD in .env") }
})();
