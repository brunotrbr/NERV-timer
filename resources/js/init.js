// Init Global Vars

let nervClock;
let nervCron;
let drawMe;
let hourlyRefresh;
let init;
let crono = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
}
let theTime = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    meridian: 'AM'
}

// Date
function theDate(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth()).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    today = monthNames[parseInt(mm)] + ' ' + dd + ', ' + yyyy;
    return today;
}
const dateTXT = document.getElementById('date');
dateTXT.innerText = theDate();



setInterval(function(){
    dateTXT.innerText = theDate();
}, 60000);

window.onload = function() {
    init = function() {
        nervClock = new GUI();
        nervClock.on();
    }
    nervCron = new Cronometer();
    drawMe = new drawClock();
    levelStatus = new powerLevel();
    init();
}
