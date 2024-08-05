const video = document.getElementById('video');

// Start video stream
navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error('Error accessing the camera: ', err));

// Capture and send video frame to backend every second
setInterval(() => {
    captureAndRecognize();
}, 1000);

async function captureAndRecognize() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    const blob = await fetch(dataUrl).then(res => res.blob());

    const formData = new FormData();
    formData.append('image', blob, 'frame.jpg');

    fetch('http://localhost:5173/recognize', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Recognized faces:', data);
        // Display the results
        data.forEach((name, i) => {
            console.log(`Face ${i + 1}: ${name}`);
        });
    })
    .catch(err => console.error('Error:', err));
}
