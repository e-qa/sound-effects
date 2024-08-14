const record = document.getElementById("record");
const stopRecord = document.getElementById("stop-record");
const playback = document.getElementById("playback");
const download = document.getElementById("download");
const container = document.getElementById("container");
const recording = document.getElementById("recording");
const reverb = document.getElementById("reverb");
const delay = document.getElementById("delay");
const chorus = document.getElementById("chorus");
const distortion = document.getElementById("distortion");
const userMedia = new Tone.UserMedia();

let audioSrc;
let recorder;
let player;
let currentEffect = null;

record.addEventListener("click", async () => {
  await userMedia.open();
  recorder = new Tone.Recorder();
  userMedia.connect(recorder);
  startRecording();
});

function startRecording() {
  recording.textContent = "Recording";
  recorder.start();
}

stopRecord.addEventListener("click", async () => {
  if (recorder) {
    const recording = await recorder.stop();
    const url = URL.createObjectURL(recording);
    createAudioEL(url);
  }
  recording.textContent = "";
});

function createAudioEL(src) {
  const audio = document.createElement("audio");
  audio.src = src;
  audio.controls = true;
  audioSrc = src;
  player = new Tone.Player(audioSrc).toDestination();
}

function applyEffect(effect) {
  if (currentEffect) {
    player.disconnect(currentEffect);
  }
  player.connect(effect);
  currentEffect = effect;
  player.start();
}

reverb.addEventListener("click", async () => {
  const reverb = new Tone.JCReverb({
    roomSize: 0.8,
    wet: 0.5,
  }).toDestination();
  applyEffect(reverb);
});

chorus.addEventListener("click", async () => {
  const chorusEffect = new Tone.Chorus({
    frequency: 10,
    delayTime: 0.1,
    depth: 0.9,
    spread: 180,
  }).toDestination();
  applyEffect(chorusEffect);
});

distortion.addEventListener("click", async () => {
  const distort = new Tone.Distortion({
    distortion: 0.8,
    saturate: 0.5,
  }).toDestination();
  applyEffect(distort);
});

delay.addEventListener("click", async () => {
  const delayEffect = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.6,
    wet: 0.5,
  }).toDestination();

  applyEffect(delayEffect);
});
