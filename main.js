import * as faceAI from 'face-api.js'

let Video = document.querySelector('#video')
let canvas = document.querySelector('canvas')

function StartVideo (){
 navigator.mediaDevices.getUserMedia({
  video:{
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