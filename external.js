
const render = require('electron').ipcRenderer;
let credentials;

function startScrap() {
    console.log("ready to scrap");
    let titleElem = document.getElementsByClassName('document_title')[0];
    let titleName = titleElem.innerText;
    console.log(titleName);
    render.send('titleName', titleName);
    render.once('titlePut', function(e){ 
        console.log("Title Put");
        let clickListen = document.getElementsByClassName('cta')[0];
        clickListen.click();
    });
}


function putCredentials(){
    console.log("ready to put credentials");
    let emailInput = document.getElementById('login_or_email');
    let passInput = document.getElementById('login_password');
    let subButton = document.getElementsByClassName('submit_btn')[0];
    emailInput.value = credentials.user;
    passInput.value = credentials.pass;
    subButton.click();
}

window.onload = function(){
    console.log(window.location.href);
    let signInButton = document.getElementsByClassName("sign_in_button");
    console.log(signInButton[0]);
    if(signInButton[0]){ 
        signInButton[0].click();
        render.send('getData');
        render.once('credentials', function(e, data){ 
             credentials = data;
             console.log(credentials);
             setTimeout(putCredentials, 5000);
        });
    }else{
        setTimeout(startScrap, 5000);
    }
}