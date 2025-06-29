const fileInput = document.getElementById("audioFile");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

fileInput.onchange = function () {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const file = fileInput.files[0];
  const audio = new Audio(URL.createObjectURL(file));
  const source = audioCtx.createMediaElementSource(audio);
  const analyser = audioCtx.createAnalyser();

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 256;
  const bufferLength = 500;
  const dataArray = new Uint8Array(bufferLength);

  audio.play();

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = `rgb(255,255,255)`;
      ctx.fillRect(x, canvas.height - barHeight*0.5, barWidth, barHeight*0.5);

      x += barWidth*1.75;
    }
  }
  draw();
};
