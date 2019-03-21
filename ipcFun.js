const path = require('path');
const url = require('url');
const fs = require('fs');
const ipcMain = require('electron').ipcMain;
const downloadData = require("./downloadManager.js");
const sanitize = require('sanitize-filename');
let audiobookData;
let subdirectory;
let count = 0;
global.downloadStart = true;
let downloadInterval;
let interval = true;

function startDownload(){
    if(!fs.existsSync(global.dir+'/'+subdirectory)){
        fs.mkdirSync(global.dir+'/'+subdirectory);
        console.log("Directory Created");
    }
    if(count < audiobookData.playlist.length){
        if(global.downloadStart){ 
            global.downloadStart = false;
            count += 1;
            let urlLink = count - 1;
            downloadData('chapter'+count, global.dir+'/'+subdirectory, audiobookData.playlist[urlLink].url);
            if(interval){
                interval = false;
                downloadInterval = setInterval(startDownload, 30000);
            }
        }
    }else{
        console.log("Downloading Completed...");
        clearInterval(downloadInterval);
    }
}

function startDownloading() {
    console.log(audiobookData);
    subdirectory = sanitize(global.title);
    if(subdirectory){
        startDownload();
    }
}

ipcMain.on('parsedData', function(event, data){
    fs.writeFile('audio.txt', data, function(err){
        console.log('write hit');
        if(err){
            return console.log(err);
        }
        console.log('Data saved');
        audiobookData = JSON.parse(data);
        event.sender.send('dataSaved');
        startDownloading(audiobookData);

    });
});

ipcMain.on('titleName', function(event, titleName){
    global.title = titleName;
    console.log(global.title);
    event.sender.send('titlePut');
});

ipcMain.on('getData', function(event){
    console.log("Retreving credentials");
    global.dir = global.cliData.destination;
    let credentials = {
        user: global.cliData.email,
        pass: global.cliData.pass
    }
    event.sender.send("credentials", credentials);
});