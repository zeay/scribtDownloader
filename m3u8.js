const fs = require('fs');
const m3u8stream = require('m3u8stream')

var downloadM3ua = function(file, dname, fileName){
    let dir = dname;
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let fullPath = dname+'/'+fileName;
    const stream = m3u8stream(file)
    .pipe(fs.createWriteStream(fullPath+'.mp4', {flags:'w+'}));
    stream.on('progress', (segment, totalSegment, download)=>{ 
        console.log(`${segment.num} of ${totalSegments} segments `);
    });
}

module.exports = downloadM3ua;