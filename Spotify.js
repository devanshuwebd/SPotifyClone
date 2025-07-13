async function getsongs() {
    let a = await fetch("songs.html");
    let data = await a.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let songs = [];
    let ele = div.getElementsByTagName("a");
    for (let index = 0; index < ele.length; index++) {
        const element = ele[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}
async function getimages() {
    let a = await fetch("images.html");
    let data = await a.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let images = [];
    let ele = div.getElementsByTagName("a");
    for (let index = 0; index < ele.length; index++) {
        const element = ele[index];
        if (element.href.endsWith(".jpg") || element.href.endsWith(".webp")) {
            images.push(element.href);
        }
    }
    return images;
}
function createcard(image, song) {
    let html = `<div class="playbutton">
                <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="20" fill="#1DB954" />
                <polygon points="20,17 20,33 32,25" fill="black" />
                </svg></div>
                <div class="imageofplaylist">
                    <img src="${image}" alt="image" style="object-fit: contain;">
                        </div>
                <div class="playlist">${song}</div>
                <div class="contentofplaylist">Devanshu</div>`
    return html;
}
function playsong(image, song, dur , current) {
    let html = `<div class="pic"><img src="${image}" alt="song" height="55px" width="55px"></div>
                <div class="song">${song}</div>
                <div>
                    <img class="previous invert" src="https://www.svgrepo.com/show/506285/previous.svg" height="36px" width="36px">
                    <img class="stop invert" src="https://www.svgrepo.com/show/511100/pause-circle.svg" height="36px" width="36px">
                    <img class="next invert" src="https://www.svgrepo.com/show/506264/next.svg" height="36px" width="36px">
                </div>
                <div class="control cursor">
                    <div class="circle"></div>
                </div>
                <div class="duration">${current} / ${dur}</div>`
    return html;
}
var audio = new Audio();
async function main() {
    let songs = await getsongs();
    let imageurl = await getimages();
    let song = [];
    let image = [];
    console.log(songs);
    for (let index = 0; index < songs.length; index++) {
        const element = songs[index];
        element.replaceAll("%20", " ");
        song[index] = element.split(/Songs/)[1].replaceAll("%20", " ").replace("/", "").replace(".mp3", "");
    }
    for (let index = 0; index < songs.length; index++) {
        const element = imageurl[index];
        image[index] = element;
    }
    for (let index = 0; index < songs.length; index++) {
        let a = createcard(image[index], song[index]);
        let div = document.createElement("div");
        div.classList.add("card");
        div.classList.add("cursor");
        div.innerHTML = a;
        document.querySelector(".cards").append(div);
    }
    document.querySelectorAll(".card").forEach((e) => {
        e.addEventListener("mouseenter", () => {
            let playbtn = e.querySelector(".playbutton");
            playbtn.classList.toggle("active");
        })
        e.addEventListener("mouseleave", () => {
            let playbtn = e.querySelector(".playbutton");
            playbtn.classList.toggle("active");
        })
    })
    document.querySelectorAll(".playbutton").forEach((e, index) => {
        e.addEventListener("click", () => {
            let b = e.parentElement;
            let c = b.querySelector(".imageofplaylist img").src;
            let tempsong = new Audio(songs[index]);
            let dur;
            let current;
            function formatDuration(seconds) {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            }
            tempsong.addEventListener("loadedmetadata", () => {
                dur = formatDuration(tempsong.duration);
                let a = playsong(c, b.children[2].textContent, dur , "0:00");
                audio.addEventListener("timeupdate", ()=>{
                    current = formatDuration(audio.currentTime);
                    document.querySelector(".duration").textContent = `${current} / ${dur}`;
                    document.querySelector(".circle").style.left = (audio.currentTime/ audio.duration)*100 + "%";
                })
                let div = document.createElement("div");
                div.innerHTML = a;
                div.classList.add("player");
                document.querySelector(".footer").innerHTML = "";
                document.querySelector(".footer").append(div);
                let songurl = songs[index];
                let songsrc = songurl;
                audio.src = songurl;
                audio.play();
                let s = document.querySelector(".stop");
                s.addEventListener("click", (e) => {
                    if(audio.paused){
                        audio.play();
                        e.target.src = "https://www.svgrepo.com/show/511100/pause-circle.svg";
                    }
                    else{
                        audio.pause();
                        e.target.src = "https://www.svgrepo.com/show/476381/play.svg";
                    }
                })
                document.querySelector(".control").addEventListener("click",(e)=>{
                    let percent = (e.offsetX/ e.target.getBoundingClientRect().width) * 100;
                    document.querySelector(".circle").style.left = percent + "%";
                    audio.currentTime = ((audio.duration)*percent)/100;
                })
            })
        })
    })
}
main();