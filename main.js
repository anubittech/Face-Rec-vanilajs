import * as faceAI from "face-api.js";

let Video = document.querySelector("#video");
// let canvas = document.querySelector("canvas");


Promise.all([
  faceAI.nets.tinyFaceDetector.loadFromUri('/models'),
  faceAI.nets.faceLandmark68Net.loadFromUri('/models'),
  faceAI.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo(){
  navigator.mediaDevices.getUserMedia({video:{}})
    .then(strm => Video.srcObject = strm)
    .catch(err => console.log("Error:",err));
}
startVideo()
Video.addEventListener('play',()=>{
      let canvas = faceAI.createCanvasFromMedia(Video);
      document.body.append(canvas)
      let displaySize = {width:Video.width,height:Video.height};
      faceAI.matchDimensions(canvas,displaySize);
      setInterval(async ()=>{
        const detections = await faceAI.detectAllFaces(Video,new faceAI.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const resizedetecttions = faceAI.resizeResults(detections,displaySize);
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        faceAI.draw.drawDetections(canvas,resizedetecttions);
        faceAI.draw.drawFaceLandmarks(canvas,resizedetecttions);
        if(labeledFaceDescriptors){
          const faceMatcher = new faceAI.FaceMatcher(labeledFaceDescriptors,0.6);
          const results = resizedetecttions.map(d => faceMatcher.findBestMatch(d.descriptor));
          results.forEach((result,i)=>{
            const box = resizedetecttions[i].detection.box;
            const drwaBox = new faceAI.draw.DrawBox(box,{label:result.toString()});
            drwaBox.draw(canvas)
          })
        }
      },100)
})
let labeledFaceDescriptors;

async function LoadLabelImages(){
  const labels = ['Titas'];
  return Promise.all(
    labels.map(async label =>{
      const descriptions = [];
      for (let i = 1 ;i <= 2;i++){
        const img = await faceAI.fetchImage(`/Img/${label}/${i}.jpg`);
        const detection = await faceAI.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detection.descriptor);
      }
      return new faceAI.LabeledFaceDescriptors(label,descriptions)
    })
  )
}

document.addEventListener('DOMContentLoaded', async ()=>{
  labeledFaceDescriptors = await LoadLabelImages();
})
