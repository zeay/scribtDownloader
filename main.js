const {app, BrowserWindow, IncomingMessage} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { session } = require('electron');
require('events').EventEmitter.defaultMaxListeners = Infinity;
global.title = "";
// var count = 0;
// var match = false;
 global.cliData = {
    url: process.argv[2],
    email: process.argv[3],
    pass: process.argv[4],
    destination: process.argv[5]
};
console.log(global.cliData);
global.dir = global.cliData.destination;
const ipcFun = require('./ipcFun');

//-------------Function Started--------------------------------------------------
function createWindow () {
      // Create the browser window.
   win = new BrowserWindow({width: 800, height: 600, webPreferences:{
     nodeIntegration: false,
     allowRunningInsecureContent:true,
     preload: __dirname+'/external.js'
   }});
   win.setMenu(null);
    const ses = win.webContents.session;
    ses.clearCache(()=>{
      console.log("cached clear");
    });
    ses.clearStorageData();
    ses.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36");
    //load url;
    win.loadURL(cliData.url);
    // console.log(ses.getUserAgent());
      // Open the DevTools.
    win.webContents.openDevTools();
//     win.webContents.on('dom-ready', (e)=>{
//        win.webContents.executeJavaScript();
//    });
    // session.defaultSession.webRequest.onCompleted(function(details){ 
    //    if(details.url.indexOf('playlist') > -1){ 
    //     console.log(details);  
    //     console.log(details.url); 
    //    }
    // });
    //handling new window
    win.webContents.on('new-window', (event, url)=>{
      console.log("New Window PopUp");
      event.preventDefault();
      let winNew = new BrowserWindow({width: 800, height: 600, webPreferences:{
        nodeIntegration: false,
        allowRunningInsecureContent:true,
        preload: __dirname+'/popup.js'
      }});
      winNew.loadURL(url);
      event.newGuest = winNew;
      winNew.webContents.openDevTools();
      //detecting media play
      winNew.webContents.on('media-started-playing', function(e){
        console.log("Media started playing");
    });

    });
    
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

