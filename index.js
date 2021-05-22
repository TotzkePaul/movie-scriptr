//starting point https://github.com/shaynet10/puppeteer-mass-screenshots/blob/5f40f804c8815ba391d150a0ded9926115d4f082/index.js
const puppeteer = require('puppeteer');
const { join } = require('path');
const fs = require('fs').promises;
const emptyFunction = async() => {};
const defaultAfterWritingNewFile = async(filename) => console.log(`${filename} was written`);
const outputFolder = './output/'
const writeImageFilename = async (data) => {
    const filename = join(outputFolder, Date.now().toString() + '.jpg');
    await fs.writeFile(filename, data, 'base64');
    return filename;
};


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
  await page.goto('http://www.jomendez.com/portfolio/');
  await page.screenshot({ path: 'example.png' });
  await page.pdf({path: 'example.pdf', format: 'A4'});

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

        function wait(timeout) {
            return new Promise(resolve => {
                setTimeout(resolve, timeout);
            });
        }

        await start();
        await wait(5000);
        await stop();
        console.log("Success")
  await browser.close();
})();