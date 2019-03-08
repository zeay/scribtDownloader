//"https://phlearn.com/tutorial/retouch-composite-product-photography/"
///Users/aowl/Desktop
var render = require('electron').ipcRenderer;
var maindata;
//var playBtn;
var playlist;
var playContent;
var playListTitle;
var playlistCount;
var playlistIncrementer;
var count;
var totalLength;
var totalPlay
var contentName;

function clickLogin(){
    let loginBtn = document.getElementsByClassName('circled');
    if(loginBtn.length > 0){
        loginBtn[0].children[0].click();
        loginPage();   
    }else{
        fetchAsset();
    }
}

function goToLogin(){
    let loginPage = document.getElementsByClassName('or');
    loginPage[0].children[0].click();
    credentials();
}

function putCredentials(){
    let username = document.getElementsByName('username');
    username[0].value = "arosky@gmail.com";
    let password = document.getElementsByName('password');
    password[0].value = "espararau";
    let loginBtnn = document.getElementsByName('login');
    loginBtnn[0].click();
}

function downloadAsset() {
    let tableContent = document.getElementsByClassName('display_alone');
    if(tableContent[0]){
        tableContent[0].children[0].click();
        let asset = document.getElementsByClassName('trigger-download');
        asset[0].click();
        setTimeout(fetchVideo, 1000 * 60 * 10);
    }else{
        alert("Ahh! Contact my creator this playlist is out of my bound area.")
    }
}

function startFetching() {
    if(playlistIncrementer < totalLength){
        playListTitle = playlist[playlistIncrementer].children[0].childNodes[0].nodeValue
        playContent = playlist[playlistIncrementer].getElementsByClassName('playlist-contents');
        console.log(playListTitle);
        console.log(playContent);
        totalPlay = playContent[0].children.length;
        console.log(totalPlay);
        count = 0;
        extractPlayContent();
    }else{
        document.body.innerHTML = "<center><h1>Fetch Completed check video files before closing maybe files are in download Probably! Just Check last file</h1></center>";
    }
    
}

function extractPlayContent(){ 
    if(count < totalPlay){
        console.log(playContent);
        console.log(playContent[0]);
        playContent[0].children[count].getElementsByTagName('i')[0].click();
        setTimeout(videoGetters, 5000);
    }else{
        playlistIncrementer += 1;
        startFetching();
    }
}

function videoGetters(){ 
    let videoElem = document.getElementsByTagName('video');
    videoElem[0].pause();
    contentName = playContent[0].children[count].getElementsByClassName('title')[0].innerText;
    render.send('videosignaling', playListTitle, contentName);
    count += 1;
    //setTimeout(extractPlayContent, 1000 * 60 * 10);
    let videoChecking = setInterval(function(){
        console.log("Checking New Download");
        render.send('downloadChecking');
    }, 45000);
    render.once('sendNewDownload', function(e){
        clearInterval(videoChecking);
        extractPlayContent();
    });
}

function startRipping(){
    setTimeout(clickLogin,10000);
}

function loginPage() {
    setTimeout(goToLogin, 5000)
}

function credentials(){
    setTimeout(putCredentials, 5000);
}

function fetchAsset() {
    setTimeout(downloadAsset, 5000);
}

function fetchVideo(){ 
    playlist = document.getElementsByClassName('playlist');
//    playContent = document.getElementsByClassName('playlist-contents');
//    console.log(playContent);
    totalLength = playlist.length;
    playlistIncrementer = 0;
    console.log(playlist, totalLength, playlistIncrementer);
    startFetching();
    
}

//Onload.
window.onload = function(){
    console.log(window.location.href);
    var courseTitle = document.getElementsByClassName('overview-title')[0].getElementsByTagName('h1')[0].innerText;
    console.log(courseTitle);
    render.send('loaded', courseTitle);
    render.on('intialData', function(e, data){
       console.log(data);
        maindata = data;
        startRipping();
    });
}