setTimeout(()=>{
    if(db){
        let videoDBTransaction = db.transaction("video","readonly")
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();

        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
        

            let galleryCont = document.querySelector(".gallery-cont")
            videoResult.forEach((videoObj)=>{
                let mediaElem = document.createElement("div")
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);
                mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;
                let deleteBtn = mediaElem.querySelector(".delete")
                deleteBtn.addEventListener("click",deleteListener);

                let downloadBtn = mediaElem.querySelector(".download")
                downloadBtn.addEventListener("click",downloadListener)

                galleryCont.appendChild(mediaElem);
            })
        }
    }
},100)

setTimeout(()=>{
    if(db){
        let imageDBTransaction = db.transaction("image","readonly")
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let galleryCont = document.querySelector(".gallery-cont")
            imageResult.forEach((imageObj)=>{
                let mediaElem = document.createElement("div")
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",imageObj.id);

                let url = imageObj.url;
                mediaElem.innerHTML = `
                <div class="media">
                    <img src = "${url}" />
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `;
                let deleteBtn = mediaElem.querySelector(".delete")
                deleteBtn.addEventListener("click",deleteListener);

                let downloadBtn = mediaElem.querySelector(".download")
                downloadBtn.addEventListener("click",downloadListener)
                galleryCont.appendChild(mediaElem);
            })
        }
    }
},100)


function deleteListener(e){
    //DB Removel
    let id = e.target.parentElement.getAttribute("id");
    if(id.slice(0,3) === "vid"){
        let videoDBTransaction = db.transaction("video","readwrite")
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
    }else if(id.slice(0,3)==="img"){
        let imageDBTransaction = db.transaction("image","readwrite")
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    }

    //ul removal
    e.target.parentElement.remove();
}

function downloadListener(e){

    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);

    if(type === "vid"){
        let videoDBTransaction = db.transaction("video","readwrite")
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);

        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let videoUrl = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a")
            a.href = videoUrl;
            a.download = "stream.mp4"
            a.click();

        }   
    }else if(type ==="img"){
        let imageDBTransaction = db.transaction("image","readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);

        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a = document.createElement("a")
            a.href = imageResult.url;
            a.download = "image.jpg"
            a.click();
        }   
    }
}