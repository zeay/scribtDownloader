const fs = require('fs');
const request = require('request');
let vcount = 0;

var downloadData = function(fileName, dname, fileUrl){
    let dir = dname;
    console.log(dir);
    console.log("Starting Download...");
    let fullPath = dir+'/'+fileName;
    request(fileUrl).pipe(fs.createWriteStream(fullPath+'.mp3')).on('finish', ()=>{
        console.log("Finish...");
        global.downloadStart = true;
    }).on('error', ()=>{
        console.log("Error");
    });
}

module.exports = downloadData;