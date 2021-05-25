//starting point https://github.com/shaynet10/puppeteer-mass-screenshots/blob/5f40f804c8815ba391d150a0ded9926115d4f082/index.js
const puppeteer = require('puppeteer');
const { join } = require('path');
const fs = require('fs').promises; //async access to the file system?
const emptyFunction = async() => {};
const defaultAfterWritingNewFile = async(filename) => console.log(`${filename} was written`);
const outputFolder = './.build/frames/';

let counter = 0;
const writeImageFilename = async (data) => {
    const filename = join(outputFolder, counter++ + '.jpg');
    await fs.writeFile(filename, data, 'base64');
    return filename;
};

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

(async (options = {}) => {
    const runOptions = {
        beforeWritingImageFile: emptyFunction,
        afterWritingImageFile: defaultAfterWritingNewFile,
        beforeAck: emptyFunction,
        afterAck: emptyFunction,
        ...options
    }  
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://totzkepaul.github.io/?mode=i');

    const client = await page.target().createCDPSession();
    const canScreenshot = true;
    client.on('Page.screencastFrame', async (frameObject) => {
        if (canScreenshot) {
            await runOptions.beforeWritingImageFile();
            const filename = await writeImageFilename(frameObject.data); 
            await runOptions.afterWritingImageFile(filename);
            try {
                await runOptions.beforeAck();
                await client.send('Page.screencastFrameAck', { sessionId: frameObject.sessionId});
                await runOptions.afterAck();
            } catch(e) {
                this.canScreenshot = false;
            }
        }
    });

    const start = async (options = {}) => {
    const startOptions = {
        format: 'jpeg',
        quality: 100,
        maxWidth: 1920,
        maxHeight: 1080,
        everyNthFrame: 1,
        ...options
    };
    return client.send('Page.startScreencast', startOptions);
    }

    const stop = async () => {
    return client.send('Page.stopScreencast');
    }

    // This is the important section
    const duration = 5000;
    const mode = "i";
    if(mode =="i"){
        const fps = 30;
        const frames = fps*(duration /1000);
        for (let i = 0; i < frames; i++) {    
            await page.evaluate('moveCamera()'); // Executes JavaScript in the page context of puppeteer
            await wait(5);    
            const filename = join(outputFolder, `${i}.png`);
            await page.screenshot({ path: filename });                
            console.log(`${i+1} of ${frames}: ${filename}`);
        }
    } else {
        //old way ignore
        await start();
        await wait(duration);
        await stop();
        console.log("Success");
    }

    
    await browser.close();
})();