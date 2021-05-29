//starting point https://github.com/shaynet10/puppeteer-mass-screenshots/blob/5f40f804c8815ba391d150a0ded9926115d4f082/index.js
const puppeteer = require('puppeteer');
var config = require('./config.json');
var ffmpeg = require('fluent-ffmpeg');
const { join } = require('path');
const fs = require('fs'); //async access to the file system?
const path = require('path');
const outputFolder = './.build/';

function wait(timeout) { return new Promise(resolve => { setTimeout(resolve, timeout); }); }

function ensureDir(dirname) {    
    if (fs.existsSync(dirname)) {
      return true;
    }
    var parent = path.dirname(dirname);
    ensureDir(parent);
    fs.mkdirSync(dirname);
  }

  const buildImageSet = async (src, dst) => {    
    var command = ffmpeg();
    command.on('error', function(err) { console.log('An error occurred: ' + err.message); });
    command.on('start', function(commandLine) {    console.log('Spawned Ffmpeg with command: ' + commandLine);});
    command.on('end', function() {    console.log('Transcoding succeeded !');});
    command.on('codecData', function(data) {    console.log('Input is ' + data.audio + ' audio ' +      'with ' + data.video + ' video');});
    command.on('progress', function(progress) {console.log('Processing: ' + progress.percent + '% done');});

    let fps = '30';
    
    command.outputOptions([
        '-y',
        '-framerate', fps,
        '-start_number',  '0',
        '-i', src+"%0d.png",
        '-c:v', 'libx264'
      ]);

    command.save(dst);
};

const recordScreenCast = async (scene) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(scene.url);

    const client = await page.target().createCDPSession();
    const canScreenshot = true;
    let hasScreenShot = false;
    let i = 0;
    client.on('Page.screencastFrame', async (frameObject) => {
        if (canScreenshot) {
            const filename = `${scene.src}${i++}.png`;            
            await fs.promises.writeFile(filename, frameObject.data, 'base64');
            console.log(`${filename} was written`);
            try {
                await client.send('Page.screencastFrameAck', { sessionId: frameObject.sessionId});
                hasScreenShot = true;
            } catch(e) {
                this.canScreenshot = false;
            }
        }
    });

    const start = async () => {return client.send('Page.startScreencast',{format:'jpeg',quality:100,maxWidth:1920,maxHeight:1080,everyNthFrame:1});}
    const stop  = async () => {return client.send('Page.stopScreencast');}

    await start(); 
    await wait(scene.duration); 
    await stop();
    await browser.close();
    return hasScreenShot;
};



const createScene = async (scene) => {
    console.log("createScene ", scene);
    const anyScreenShots = await recordScreenCast(scene);
    if(anyScreenShots){
        await buildImageSet(scene.src,scene.dst);  
    } else {
        console.log("createScene", "Error: No output", scene);
    }     
};

const createVideo = async (video) => {
    console.log(video);
    for (const index in video.scenes) {
        const scene = video.scenes[index];
        scene.id = index;
        scene.url = `${video.baseurl}${scene.page}`;       
        scene.src = `${outputFolder}${video.name}/${index}/`;    
        scene.dst = `${outputFolder}${video.name}/${index}/${index}.mp4`;  
        scene.video = video;
        ensureDir(scene.src);
        await createScene(scene); 
    }
};

(async () => {     
    for (const index in config.videos) {
        console.log("Video #", index);
        const video = config.videos[index];        
        await createVideo(video);
    }
})();
