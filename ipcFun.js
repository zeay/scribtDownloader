const path = require('path');
const url = require('url');
const fs = require('fs');
const ipcMain = require('electron').ipcMain;
const downloadM3u8 = require("./m3u8");
const sanitize = require('sanitize-filename');
global.videoDs = false
webData = global.cliData;

ipcMain.on('loaded', function(event, title){
    console.log(title);
    let saveTitle = sanitize(title);
    let intialDir = webData.destination+"/"+saveTitle
    if(!fs.existsSync(intialDir)){
        console.log("Creating Intial Dir");
        fs.mkdirSync(intialDir);
    }
    global.title = saveTitle;
    event.sender.send('intialData', webData);
});

ipcMain.on('videosignaling', function(event, directoryName, filename){ 
    let file = global.videoLinks[global.videoLinks.length-1];
    let safeDirectory = sanitize(directoryName);
    let saveFileName = sanitize(filename);
    let dName = webData.destination+"/"+global.title+"/"+safeDirectory;
    console.info(filename+" Video Downloading started");
    global.videoDs = false;
    downloadM3u8(file, dName, saveFileName);
});

ipcMain.on('downloadChecking', function(event){
    console.log("Checking New Download");
    if(global.videoDs){
        console.log("Intiated New Download");
        event.sender.send("sendNewDownload");
    }
});