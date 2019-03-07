const {app, BrowserWindow, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const request = require('request');
const { session, IncomingMessage } = require('electron');
const downloadM3u8 = require("./m3u8");
require('events').EventEmitter.defaultMaxListeners = Infinity;
var startDownload = true;
global.videoLinks = [];
var count = 0;
var match = false;
 global.cliData = {
    url: process.argv[2],
    email: process.argv[3],
    pass: process.argv[4],
    destination: process.argv[5],
    quality: process.argv[6]
};
const ipcFun = require('./ipcFun');
global.title = "";
//-------------Function Started--------------------------------------------------
function createWindow () {
      // Create the browser window.
   win = new BrowserWindow({width: 800, height: 600, webPreferences:{
     nodeIntegration: false,
     allowRunningInsecureContent:true,
     preload: __dirname+'/external.js'
   }});
   win.setMenu(null);
   win.loadURL(cliData.url);
    const ses = win.webContents.session;
    ses.clearCache(()=>{
      console.log("cached clear");
    });
    ses.clearStorageData();
    ses.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36");
    console.log(ses.getUserAgent());
    //load url;
      // Open the DevTools.
     //win.webContents.openDevTools();
//     win.webContents.on('dom-ready', (e)=>{
//        win.webContents.executeJavaScript();
//    });
    win.webContents.on('media-started-playing', function(e){
        console.log("Media started playing");
    });
    session.defaultSession.webRequest.onBeforeSendHeaders(function(details, cb){  
        if(details.url.indexOf('https://secure.brightcove.com/services/mobile/streaming/index/rendition.m3u8') > -1){
//            console.log("index of url is", details.url);
            global.videoLinks.push(details.url);
        }
        cb(details);
    });
    //download Funtion
    win.webContents.session.on('will-download', (event, item, webContents) => {
        let fileName = item.getFilename();
      item.setSavePath(cliData.destination+'/'+global.title+'/'+fileName);
      console.info("Assets Downloading Started");
      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused')
          } else {
            console.log(`Received bytes: ${item.getReceivedBytes()}`)
          }
        }
      })
      item.once('done', (event, state) => {
        if (state === 'completed') {
          console.log('Download successfully')
        } else {
          console.log(`Download failed: ${state}`)
        }
      })
    })
    
      win.on('closed', () => {
        win = null
      });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  };
});

