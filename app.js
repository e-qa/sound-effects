const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const record = document.getElementById("record");

const userMedia = new Tone.UserMedia();
let recorder;

startBtn.addEventListener("click", async () => {
  await userMedia.open();

  const vibrato = new Tone.Vibrato({
    maxDelay: 0.3,
    frequency: 0.8,
    depth: 0.1,
  });

  const reverb = new Tone.Reverb({
    wet: 1,
    decay: 1.9,
    preDelay: 0.2,
  });

  const delay = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.5,
  });

  recorder = new Tone.Recorder();
  // Microphone -> Vibrato -> Reverb -> Delay -> Recorder -> Speaker
  userMedia.connect(vibrato);
  vibrato.connect(reverb);
  reverb.connect(delay);
  delay.connect(recorder);
  delay.toDestination();
});

record.addEventListener("click", async () => {
  if (recorder) {
    recorder.start();
    setTimeout(async () => {
      const recording = await recorder.stop();
      const url = URL.createObjectURL(recording);
      const anchor = document.createElement("a");
      anchor.download = "recording.wav";
      anchor.href = url;
      anchor.click();
    }, 5000);
  }
});

stopBtn.addEventListener("click", () => {
  if (userMedia.state === "started") {
    userMedia.close();
    userMedia.disconnect();
  }
});
