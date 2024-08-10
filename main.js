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
]).then(startvideo);

function startvideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: {},
    })
    .then((strm) => (video.srcObject = strm))
    .catch((err) => console.log(err));
// video.srcObject = '/speech.mp4'
}

async function FaceDetect() {
    let refImage = await LoadLabelImage()
    let facematcher = new faceapi.FaceMatcher(refImage,0.6)
  setInterval(async () => {
    let detecttion = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    canvas.innerHTML = faceapi.createCanvasFromMedia(video);
    faceapi.matchDimensions(canvas, {
      width: video.width,
      height: video.height,
    });
    let resizedDetect = faceapi.resizeResults(detecttion, {
      width: video.width,
      height: video.height,
    })
    let faceResult = resizedDetect.map((fd => facematcher.findBestMatch(fd.descriptor)))
    faceResult.forEach((result,i)=>{
        let box = resizedDetect[i].detection.box
        let drawbox = new faceapi.draw.DrawBox(box,{label:result.toString()})
        drawbox.draw(canvas)
    })
    faceapi.draw.drawDetections(canvas, resizedDetect);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetect);
  }, 100);
}

function LoadLabelImage(){
    const ImageLabels = ["Anupam","Titas"]
    return Promise.all(
        ImageLabels.map(async(labels)=>{
            let description = []
            for (let i = 1 ; i <= 2 ; i++){
                let img = await faceapi.fetchImage(`/Img/${labels}/${i}.jpg`);
                const detecttions = await faceapi.detectSingleFace(img,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()
               if(detecttions){
                description.push(detecttions.descriptor)
               }else{
                console.warn(`No face detcted image:`);
                
               }
            }
            return new faceapi.LabeledFaceDescriptors(labels,description)
        })
    )
}

FaceDetect();
