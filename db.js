//open data base

let db;
let openRequest = indexedDB.open("myDataBase");

//event
openRequest.addEventListener("success",(e)=>{
    console.log("DB success");
    db = openRequest.result;
})

openRequest.addEventListener("error",(e)=>{
    console.log("DB error");
})

openRequest.addEventListener("upgradeneeded",(e)=>{
    console.log("DB upgreadeneeded and also for initial DB creater");
    db = openRequest.result;

    //create object store
    db.createObjectStore("video",{keyPath:"id"})
    db.createObjectStore("image",{keyPath:"id"})
})