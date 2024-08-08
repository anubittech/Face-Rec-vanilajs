import * as faceapi from "face-api.js";
let video = document.querySelector("video");
let canvas = document.querySelector("canvas");
async function VideoRun() {
  navigator.mediaDevices
    .getUserMedia({
      video: {},
    })
    .then((strm) => (video.srcObject = strm))
    .catch((err) => console.log("Error", err));

  async function FaceDetect() {
    setInterval(async () => {
      let detection = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();
      canvas.innerHTML = faceapi.createCanvasFromMedia(video);
      faceapi.matchDimensions(canvas, { width: 400, height: 500 });
      faceDesc = faceapi.resizeResults(detection, { width: 400, height: 500 });
      faceapi.draw.drawDetections(canvas, faceDesc);

      // faceapi.draw.drawFaceLandmarks(canvas, faceDesc);
      faceapi.draw.drawFaceExpressions(canvas, faceDesc);
    }, 100);
  }

  async function LoadModel() {
    const MODEL_URL = "/models";

    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadFaceExpressionModel(MODEL_URL);
  }

  FaceDetect();
  LoadModel();
}

VideoRun();
