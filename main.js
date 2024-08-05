import * as faceai from 'face-api.js'
const video = document.getElementById('video');

// Start video stream
Promise.all([
    faceai.nets.tinyFaceDetector.loadFromUri('/models'),
    faceai.nets.faceLandmark68Net.loadFromUri('/models'),
    faceai.nets.faceRecognitionNet.loadFromUri('/models'),
    faceai.nets.faceExpressionNet.loadFromUri('/models'),
]).then(Videoplay)

function Videoplay(){
    navigator.mediaDevices.getUserMedia({
        video:{}
    },
    strm => video.srcObject = strm,
    err => console.error(err)
)
}

video.addEventListener('play',()=>{
    const canvas = faceai.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaysize = {width:video.width,height:video.height}
    faceai.matchDimensions(canvas,displaysize)
    setInterval( async ()=>{
        const detections = await faceai.detectAllFaces(video, new faceai.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizeDetect = faceai.resizeResults(detections,displaysize)
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceai.draw.drawDetections(canvas, resizeDetect)
    faceai.draw.drawFaceLandmarks(canvas, resizeDetect)
    faceai.draw.drawFaceExpressions(canvas, resizeDetect)

    },100)
})

// Capture and send video frame to backend every second
// setInterval(() => {
//     captureAndRecognize();
// }, 1000);

// async function captureAndRecognize() {
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const dataUrl = canvas.toDataURL('image/jpeg');
//     const blob = await fetch(dataUrl).then(res => res.blob());

//     const formData = new FormData();
//     formData.append('image', blob, 'frame.jpg');

//     fetch('http://localhost:5173/recognize', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Recognized faces:', data);
//         // Display the results
//         data.forEach((name, i) => {
//             console.log(`Face ${i + 1}: ${name}`);
//         });
//     })
//     .catch(err => console.error('Error:', err));
// }

