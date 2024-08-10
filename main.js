import * as faceapi from "face-api.js";
let video = document.querySelector("video");
let canvas = document.querySelector("canvas");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  console.log("load models"),
]).then(startvideo)

function startvideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: {},
    })
    .then((strm) => (video.srcObject = strm))
    .catch((err) => console.log(err));
}

async function FaceDetect() {
    setInterval(async ()=>{
        let detecttion = await faceapi.detectSingleFace(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        canvas.innerHTML = faceapi.createCanvasFromMedia(video)
        faceapi.matchDimensions(canvas,{
            width:video.width,
            height:video.height
        })
        let resizedDetect = faceapi.resizeResults(detecttion,{
            width:video.width,
            height:video.height
        })
        faceapi.draw.drawDetections(canvas,resizedDetect)
        faceapi.draw.drawFaceExpressions(canvas,resizedDetect)
    },100)
}
FaceDetect()