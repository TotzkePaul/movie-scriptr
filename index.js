//starting point https://github.com/shaynet10/puppeteer-mass-screenshots/blob/5f40f804c8815ba391d150a0ded9926115d4f082/index.js
const puppeteer = require('puppeteer');
var config = require('./config.json');
var ffmpeg = require('fluent-ffmpeg');
const { join } = require('path');
const fs = require('fs'); //async access to the file system?
const path = require('path');
const buildFolder = './.build/';
const rebuild = process.env.CLEAN == 'true';

function wait(timeout) { return new Promise(resolve => { setTimeout(resolve, timeout); }); }

function ensureDir(dirname) {    
    if (fs.existsSync(dirname)) {
      return true;
    }
    var parent = path.dirname(dirname);
    ensureDir(parent);
    fs.mkdirSync(dirname);
  }

  async function mergeFilesAsync(files, folder, filename)
{
	return new Promise((resolve, reject) => {
	
		var cmd = ffmpeg({priority: 20}).videoCodec('h264').fps(29.7)
		.on('error', function(err) {
			console.log('An error occurred: ' + err.message);
			resolve()
		})
		.on('end', function() {
			console.log(filename + ': Processing finished !');
			resolve()
		});

		for (var i = 0; i < files.length; i++)
		{
			cmd.input(files[i]);
		}
	
		cmd.mergeToFile(folder + "/" + filename, folder);
	});
}

  const buildImageSet = async (src, dst, fps) => {    
    var command = ffmpeg(src+"%0d.jpg");
    command.on('error', function(err) { console.log('An error occurred: ' + err.message); });
    command.on('start', function(commandLine) {    console.log('Spawned Ffmpeg with command: ' + commandLine);});
    command.on('end', function() {    console.log('Transcoding succeeded !');});
    command.on('codecData', function(data) {    console.log('Input is ' + data.audio + ' audio ' +      'with ' + data.video + ' video');});
    command.on('progress', function(progress) {console.log('Processing: ' + progress.percent + '% done');});

    
    command
    .inputFPS(fps)
    .videoCodec('libx264');

    command.save(dst);
};

const mergeScenes = async (video) => {    
    var command = ffmpeg().videoCodec('libx264').outputFPS(video.fps);
    command.on('error', function(err) { console.log('Error: ', err); });
    command.on('start', function(commandLine) {    console.log('Spawned Ffmpeg with command: ' + commandLine);});
    command.on('end', function() {    console.log('Finished mergeScenes!');});
    command.on('codecData', function(data) {    console.log('Input is ' + data.audio + ' audio ' +      'with ' + data.video + ' video');});
    command.on('progress', function(progress) {console.log('Processing: ' + progress + '% done',progress);});

    var videoNames = [];

    video.scenes.forEach(value => videoNames.push(value.dst));

    videoNames.forEach(file => command = command.mergeAdd(file));

    command.mergeToFile(video.dst);
};

const recordScreenCast = async (scene) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(scene.url);

    const client = await page.target().createCDPSession();
    const canScreenshot = true;
    let screenshots = [];
    let i = 0;
    client.on('Page.screencastFrame', async (frameObject) => {
        if (canScreenshot) {
            const filename = `${scene.src}${i++}.jpg`;            
            await fs.promises.writeFile(filename, frameObject.data, 'base64');
            console.log(`${filename} was written`);
            screenshots.push(filename);
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
    await wait(500); // Prevent errors from 'await client.send('Page.screencastFrameAck', ...'
    await browser.close();
    return screenshots;
};

const createScene = async (scene) => {
    console.log("createScene", scene);
    const screenshots = await recordScreenCast(scene);
    if(screenshots.length != 0){
        const fps = screenshots.length/(scene.duration/1000)
        console.log("createScene", "calling buildImageSet", scene.src,scene.dst);
        await buildImageSet(scene.src,scene.dst, fps);  
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
        scene.src = `${buildFolder}${video.name}/${index}/`;    
        scene.dst = `${buildFolder}${video.name}/${index}/${index}.mp4`;  
        scene.video = video;
        ensureDir(scene.src);
        if(rebuild){
            await createScene(scene); 
        }        
    }
};

(async () => {     
    if(!rebuild){
        console.log("Skipping all createScene")
    }  
    for (const index in config.videos) {
        console.log("Video #", index);
        const video = config.videos[index];        
        video.dst = `${buildFolder}${video.name}/${video.name}.${video.type}`;    
        await createVideo(video);
        await mergeScenes(video);
    }
})();
