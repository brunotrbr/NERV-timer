//global functions

let cronPaused = false;
const getId = function(part) {
    return document.getElementById(part);
}

// sounds

let tickingsecs = new Howl({
    src: ['src/sounds/tic.mp3']
});
let alarm = new Howl({
    src: ['src/sounds/ping.mp3']
});
let theBeast = new Howl({
    src: ['src/sounds/the-beast.mp3']
});

let shutdown = new Howl({
    src: ['src/sounds/NervShutdown.mp3']
});

let audioMuted = false;
const nervAudio = function(){
    audioMuted = !audioMuted;
    const volume = audioMuted ? 0 : 1;
    tickingsecs.volume(volume);
    alarm.volume(volume);
    theBeast.volume(volume);
    shutdown.volume(volume);
    return audioMuted;
}





// Classes
class Timer {
    constructor() {
        this.hours = new Date().getHours();
        this.minutes = new Date().getMinutes();
        this.seconds = new Date().getSeconds();
        this.active = true;
        this.ticker = setInterval(() => {
            let currentDate = new Date();
            let hours = (currentDate.getHours() > 12 ? currentDate.getHours()-12 : currentDate.getHours());
            hours = (hours < 10 ? '0' : '') + hours;
            let minutes = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
            let seconds = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();
            this.hours = hours;
            this.minutes = minutes;
            this.seconds = seconds;
            let h = hours;
            let m = minutes;
            let s = seconds;
            let ms = 0;
            if (this.active)
            drawMe.draw(h, m, s, ms);
        }, 1000);
    }
    pause() {
        this.active = false;
    }
    
    start() {
        this.active = true;
    }
}

class GUI extends Timer{
    constructor(hours, minutes, seconds, active){
        super(hours, minutes, seconds, active);
    }
    checkTime(what) {
        let h = new Date().getHours();
        if (what == 'level') {
            let dayLevel = parseInt((h / 22)*100)
            return dayLevel;
        }
        if (what == 'meridian') {
            if (h >= 12) {
                return 'PM';
            } else {
                return 'AM';
            }
        }
        
    }
    setVisuals() {
        this.start();
        let meridian = this.checkTime('meridian');
        getId("timeSession").src = `src/${meridian}-img.png`;
    }
    on(){
        this.setVisuals();
    }
    
    
}

class Cronometer {
    constructor() {
        this.timeUpdate;
        this.duration;
        this.setStopwatch;
        this.counter;
        this.paused;
        this.mode;
        this.berserk = false;
        this.active = false;
    }
    start(duration, mode){
        this.active = true;
        let startTime = new Date();
        let prev_hours = crono.hours;
        let prev_minutes = crono.minutes;
        let prev_seconds = crono.seconds;
        let prev_milliseconds = crono.milliseconds;
        nervClock.pause();
        if (mode == 'countdown' && !cronPaused) {
            duration = (duration*60)*1000;
            this.duration = duration;
            this.mode = mode;
        } 
        if (mode == 'countdown' && cronPaused) {
            duration = this.duration;
            this.mode = mode;
        }
        
        if (mode == 'cronometer') {
            this.mode = mode;
        } 
        
        this.timeUpdate = setInterval(function () {
            
            let timeElapsed = new Date().getTime() - startTime.getTime();
            
            if (mode == 'countdown') {
                if (cronPaused) {
                    cronPaused = false;
                    if (!savedCuntdown) {
                        startDateSaved = startTime;
                        savedCuntdown = true;
                    }
                } 
                if (!cronPaused) {
                    timeElapsed = duration - timeElapsed;
                }
                if (timeElapsed <= 0) {
                    if (nervCron.berserk) {
                        shutdown.play();
                        shutdownAnimation(true);
                    }
                    nervCron.reset();
                    return;
                }
            }

            this.hours = parseInt(timeElapsed / 1000 / 60 / 60)+prev_hours;

            this.minutes = parseInt(timeElapsed / 1000 / 60)+prev_minutes;
            if (this.minutes >= 60) this.minutes %= 60;

            this.seconds = parseInt(timeElapsed / 1000)+prev_seconds;
            if (this.seconds >= 60) this.seconds %= 60;

            this.milliseconds = timeElapsed+prev_milliseconds;
            if (this.milliseconds >= 1000) this.milliseconds %= 1000;

            this.hours = (this.hours < 10 ? '0' : '') + this.hours;
            this.minutes = (this.minutes < 10 ? '0' : '') + this.minutes;
            this.seconds = (this.seconds < 10 ? '0' : '') + this.seconds;
            this.milliseconds = this.milliseconds.toString();
            this.milliseconds = Number(this.milliseconds.slice(0, 2));
            
            crono.hours        = parseInt(this.hours);
            crono.minutes      = parseInt(this.minutes);
            crono.seconds      = parseInt(this.seconds);
            crono.milliseconds = parseInt(this.milliseconds);
            
            setStopwatch(this.hours, this.minutes, this.seconds, this.milliseconds);
        }, 25);
        
        function setStopwatch(hours, minutes, seconds, milliseconds){
            let realHours = hours;
            let h = minutes;
            let m = seconds;
            let s = milliseconds;
            let ms = s;
            nervCron.counter = (parseInt(h)*60)+parseInt(m);
            drawMe.draw(h, m, s, ms);
        }
    }
    stop(){
        
        this.active = false;
        clearInterval(this.timeUpdate);
    }
    reset(){
        theBeast.stop();
        this.active = false;
        nervCron.berserk = false;
        this.stop();
        crono.hours = crono.minutes = crono.seconds = crono.milliseconds = 0;
        drawMe.draw('00', '00', '00', '00');
    }
}

class drawClock {
    constructor(){
        this.count = 0;
        this.countdown = 0;
        
    }
    draw(h, m, s, ms) {
        if (parseInt(h)+parseInt(m)+parseInt(s) == 0) {
            alarm.play();
        }

        let level;
        let duration = nervCron.duration;
        
        let thisHour = document.getElementById('clockHour').innerText;
        if (getId("clockSecond").innerText !== s) {
            if (parseInt(thisHour) <= 0 && nervCron.berserk) {
                randomFX('hard');
            }
                
        }
        if (getId("clockMinute").innerText !== m) {
            let rndrate = 1;

            if (parseInt(thisHour) >= 2 && nervCron.berserk) {
                randomFX('clear');
            }

            if (parseInt(thisHour) <= 2 && nervCron.berserk) {
                randomFX();
            }
            
            if (parseInt(thisHour) <= 0 && nervCron.berserk) {
                rndrate = Math.random(1.5)+0.8;
            }
            tickingsecs.rate(rndrate);
            dateTXT.innerText = theDate();

        }
        if (getId("clockHour").innerText !== h) {
            tickingsecs.play();
        }
        if (nervClock.active && !nervCron.active) {
            level = parseInt((new Date().getHours() / 24)*100);
        } 
        if (nervCron.active && !nervClock.active) {
            if (nervCron.mode == 'cronometer') {
                level = parseInt((nervCron.counter/3600)*100);
            }
            if (nervCron.mode == 'countdown') {
                duration = duration/1000;
                level = parseInt((nervCron.counter/duration)*100);
            }
        }
        if (this.count != parseInt(m)) {
            this.count = parseInt(m);
        }
        
        levelStatus.levelHUD(level);
        getId("clockHour").innerText = h;
        getId("clockMinute").innerText = m;
        getId("clockSecond").innerText = s;
        
    }
}

class powerLevel {
    levelHUD(level){
        let position;
        if (nervCron.active) {
            position = 75 - parseInt(75*(level/100));
        } else {
            position = parseInt(75*(level/100));
        }
        if (position == undefined || isNaN(position)) {
            position = 75;
        }
        getId("wrapper").style.backgroundPositionX = `${Math.round(position * 8)}px`;
    }
}
