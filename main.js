import * as faceAI from "face-api.js";

let Video = document.querySelector("#video");
// let canvas = document.querySelector("canvas");


Promise.all([
  faceAI.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceAI.nets.tinyFaceDetector.loadFromUri('/models'),
  faceAI.nets.faceLandmark68Net.loadFromUri('/models'),
  faceAI.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startVideo)
  .catch(err => console.error("Error Loading models:",err));

function startVideo(){
  navigator.mediaDevices.getUserMedia({video:{}})
    .then(strm => Video.srcObject = strm)
    console.log("video start")
    .catch(err => console.log("Error accessing camera:",err));
}
// startVideo()
Video.addEventListener('play',()=>{
  console.log("Video play event triggered");
      let canvas = faceAI.createCanvasFromMedia(Video);
      document.body.append(canvas)
      let displaySize = {width:Video.width,height:Video.height};
      faceAI.matchDimensions(canvas,displaySize);
      setInterval(async ()=>{
        const detections = await faceAI.detectAllFaces(Video,new faceAI.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        console.log("Detection:",detections);
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
            drwaBox.draw(canvas);
            console.log("face matched",result.toString());
          })
        }
      },100)
})
let labeledFaceDescriptors;
console.log("line 47 run");
async function LoadLabelImages(){
  const labels = ['Titas'];
  return Promise.all(
    labels.map(async label =>{
      const descriptions = [];
      for (let i = 1 ;i <= 2;i++){
        const img = await faceAI.fetchImage(`/Img/${label}/${i}.jpg`);
        console.log("image label func")
        const detection = await faceAI.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detection.descriptor);
      }
      console.log("Error loading images for {label}");
      return new faceAI.LabeledFaceDescriptors(label,descriptions)
    })
  )
}
console.log("line 63 run");
document.addEventListener('DOMContentLoaded', async ()=>{
  labeledFaceDescriptors = await LoadLabelImages();
  console.log("loaded run");
})
console.log("line 67 run");
