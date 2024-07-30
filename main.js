import * as faceAI from 'face-api.js'

let Video = document.querySelector('#video')
let canvas = document.querySelector('canvas')

function StartVideo (){
  navigator.mediaDevices.getUserMedia({
    video:{facingMode:"user"},
    
  },
  stream => Video.srcObject = stream,
  err => console.log("error",err)
)
}

StartVideo()