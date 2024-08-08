import * as faceapi from "face-api.js";
let video = document.querySelector("video");
let canvas = document.querySelector("canvas");

document.addEventListener("load", () => {
  async function face() {
    const MODEL_URL = "/models";

    await faceapi.loadSsdMobilenetv1Model(MODEL_URL),
      await faceapi.loadFaceLandmarkModel(MODEL_URL),
      await faceapi.loadFaceRecognitionModel(MODEL_URL),
      await faceapi.loadFaceExpressionModel(MODEL_URL);
    const stream = navigator.mediaDevices.getUserMedia({
      video: {},
    });
    video.srcObject = stream;
    let faceDetect = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();
    let canvasctx = canvas
      .getContext("2d")
      .clearRect(0, 0, video.width, video.height);
    faceapi.matchDimensions(canvasctx, video);
    let faceResize = faceapi.resizeResults(faceDetect, video);
    faceapi.draw.drawDetections(canvasctx, faceResize);
    faceapi.draw.drawFaceLandmarks(canvasctx, faceResize);
    faceapi.draw.drawFaceExpressions(canvasctx, faceResize);
  }
  face();
});
