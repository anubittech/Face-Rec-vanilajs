import * as faceAI from "face-api.js";

let Video = document.querySelector("#video");
let canvas = document.querySelector("canvas");

const RunFaceRec = async ()=>{
  let stream = await navigator.mediaDevices.getUserMedia({
    video:true,
    audio:false
  })
  Video.scrObject = stream

  await Promise.all([
    faceAI.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceAI.nets.faceLandmark68Net.loadFromUri('/models'),
    faceAI.nets.faceRecognitionNet.loadFromUri('/models'),
    faceAI.nets.ssdMobilenetv1.loadFromUri('/models'),
  ])
 canvas.style.left = Video.offsetLeft
 canvas.style.top = Video.offsetTop
 canvas.width = Video.width
 canvas.height = Video.height
     
  
}

RunFaceRec()