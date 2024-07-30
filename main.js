import * as faceAI from 'face-api.js'

let Video = document.querySelector('#video')
let canvas = document.querySelector('canvas')

function StartVideo (){
 navigator.mediaDevices.getUserMedia({
  video:{
    // width:1980,
    // height:1080,
    facingMode:"user"
  }
 }
 
).then((stream)=>{
  Video.srcObject = stream;
  Video.play()
})
.catch((err)=>{
  console.log(`Error:${err}`)
})
 
}

StartVideo()