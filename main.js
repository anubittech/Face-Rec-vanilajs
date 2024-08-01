import * as faceAI from "face-api.js";

let Video = document.querySelector("#video");
let canvas = document.querySelector("canvas");



function startVideo(){
  navigator.mediaDevices.getUserMedia({video:{}})
    .then(strm => Video.srcObject = strm)
    .catch(err => console.log("Error:",err));
}
startVideo()

