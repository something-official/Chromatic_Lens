const video = document.querySelector('#video');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const cameraButton = document.querySelector('#camera');
const sampleButton = document.querySelector('#sample');
const status = document.querySelector('#status');
const sampleInput = document.querySelector('#sampleInput');
let stream = null;
let animationFrame = 0;
let sampleMode = true;

function resize() {
  const width = canvas.clientWidth || 640;
  const height = canvas.clientHeight || 360;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawSample(time = 0) {
  const width = canvas.clientWidth || 640;
  const height = canvas.clientHeight || 360;
  const glow = 0.5 + Math.sin(time / 800) * 0.15;
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#172554');
  gradient.addColorStop(.5, 'rgba(34, 211, 238, ' + glow + ')');
  gradient.addColorStop(1, '#86198f');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  for (let i = 0; i < 12; i += 1) {
    context.beginPath();
    context.fillStyle = i % 2 ? 'rgba(240, 171, 252, .5)' : 'rgba(103, 232, 249, .45)';
    context.arc(width * (.1 + i * .07), height * (.25 + Math.sin(time / 900 + i) * .14 + .2), 8 + i * 2, 0, Math.PI * 2);
    context.fill();
  }
}

function draw() {
  if (sampleMode || !stream || video.readyState < 2) drawSample(performance.now());
  else {
    const width = canvas.clientWidth || 640;
    const height = canvas.clientHeight || 360;
    context.drawImage(video, 0, 0, width, height);
    context.globalCompositeOperation = 'screen';
    context.fillStyle = 'rgba(34, 211, 238, .2)';
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
  }
  animationFrame = requestAnimationFrame(draw);
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    status.textContent = 'Camera mode needs HTTPS or localhost in a supported browser.';
    return;
  }
  try {
    stream?.getTracks().forEach((track) => track.stop());
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    video.srcObject = stream;
    sampleMode = false;
    sampleInput.hidden = true;
    status.textContent = 'Camera active. Frames are processed locally and never uploaded.';
  } catch (error) {
    status.textContent = error.name === 'NotAllowedError' ? 'Camera permission was not granted. Sample mode remains available.' : 'Camera unavailable. Sample mode remains available.';
  }
}

function useSample() {
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  video.srcObject = null;
  sampleMode = true;
  sampleInput.hidden = false;
  status.textContent = 'Sample mode: no camera permission requested.';
}

window.addEventListener('resize', resize);
cameraButton.addEventListener('click', startCamera);
sampleButton.addEventListener('click', useSample);
window.addEventListener('pagehide', () => stream?.getTracks().forEach((track) => track.stop()));
resize();
draw();