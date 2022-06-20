let video = document.querySelector("video");
let recordBtncont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtncont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

// var shortid = new ShortUniqueId();

let recorder;
let chunks = []; //media data in chunks
let transparentColor = "transparent";

let constraints={
    video:true,
    audio:true
}

let recordFlag = false;

navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start",(e)=>{
        chunks = [];
    })

    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data)
    })

    recorder.addEventListener("stop",(e)=>{
        //conversion of media chunks data to video
        let blob = new Blob(chunks,{type:"video/mp4"});

        if(db){
            let videoId = shortid();
            let dbTransaction = db.transaction("video","readwrite")
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id:`vid-${videoId}`,
                blobData :blob
            }
            videoStore.add(videoEntry);
        }
        // let videoURL = URL.createObjectURL(blob);
        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "stream.mp4"
        // a.click();
    })
})

//canvas capture : - click pic

captureBtncont.addEventListener("click",(e)=>{
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    
    let tool = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;


    tool.drawImage(video, 0, 0, canvas.width, canvas.height)

    //applying filter on photo
    tool.fillstyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height)

    let imageURL = canvas.toDataURL();

    if(db){
        let imageId = shortid();
        let dbTransaction = db.transaction("image","readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id:`img-${imageId}`,
            url:imageURL
        }
        imageStore.add(imageEntry)
    }

    setTimeout(()=>{
        captureBtn.classList.add("scale-capture");
    },510)
    // let a = document.createElement("a")
    // a.href = imageURL;
    // a.download = "image.jpg"
    // a.click();
})


//filter logic
let filterLayer = document.querySelector(".filter-layer")
let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterElem) =>{
    filterElem.addEventListener("click",(e)=>{
        //get style
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})


recordBtncont.addEventListener("click",(e)=>{
    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag){
        recordBtn.classList.add("scale-record");
        recorder.start();
        startTimer();
    }else{
        recordBtn.classList.remove("scale-record");
        recorder.stop();
        stopTimer();
    }
})


//timer 
let timer = document.querySelector(".timer");
let counter = 0; //represents total seconds
let timerID;
function startTimer(){
    timer.style.display = "block"
    function displayTimer(){
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds/60);
        totalSeconds = totalSeconds % 60;

        let second = totalSeconds;

        hours = (hours<10)? `0${hours}`:hours;
        minutes = (minutes<10)? `0${minutes}`:minutes;
        second = (second<10)? `0${second}`:second;

        timer.innerText = `${hours}:${minutes}:${second}`;
        counter++;
    }

    timerID = setInterval(displayTimer,1000)
}

function stopTimer(){
    clearInterval(timerID);
    timer.innerText = "00:00:00"
    timer.style.display = "none"
}
