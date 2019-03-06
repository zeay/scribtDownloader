const path = require('path');
const url = require('url');
const fs = require('fs');
const ipcMain = require('electron').ipcMain;
const downloadM3u8 = require("./m3u8");

webData = global.cliData;

ipcMain.on('loaded', function(event){
    event.sender.send('intialData', webData);
});

ipcMain.on('videosignaling', function(event, directoryName, filename){ 
//    console.log(name);
//    console.log(global.videoLinks);
    let file = global.videoLinks[global.videoLinks.length-1];
    let dName = webData.destination+"/"+directoryName;
    downloadM3u8(file, dName, filename);
})