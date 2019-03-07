const fs = require('fs');
const m3u8stream = require('m3u8stream')
let vcount = 0;

var downloadM3ua = function(file, dname, fileName){
    let dir = dname;
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let fullPath = dir+'/'+fileName;
    vcount += 1;
    const stream = m3u8stream(file)
    .pipe(fs.createWriteStream(fullPath+'.mp4')).on('finish', ()=>{
        console.log(vcount+" File Finished");
        global.videoDs = true;
    }).on('error', ()=>{
        console.log("A error occured piping file");
    });
}

module.exports = downloadM3ua;