const recordButton = document.getElementById("record");
const stopRecordButton = document.getElementById("stop-record");
const playbackButton = document.getElementById("playback");
const downloadButton = document.getElementById("download");
const recordingText = document.getElementById("recording");
const reverbButton = document.getElementById("reverb");
const delayButton = document.getElementById("delay");
const chorusButton = document.getElementById("chorus");
const distortionButton = document.getElementById("distortion");

if (Tone.context.state !== "running") {
  Tone.context.resume();
}
let audioSrc;
let recorderAudio;
let player;
let currentEffect = null;
let recorder;
let chunks = [];

document.addEventListener("click", () => {
  if (Tone.context.state === "suspended") {
    Tone.context.resume();
  }
});

const userMedia = new Tone.UserMedia();

recordButton.addEventListener("click", async () => {
  await userMedia.open();
  recorderAudio = new Tone.Recorder();
  userMedia.connect(recorderAudio);
  startRecording();
});

function startRecording() {
  recordingText.textContent = "Recording";
  recorderAudio.start();
}

stopRecordButton.addEventListener("click", async () => {
  if (recorderAudio) {
    const recording = await recorderAudio.stop();
    const url = URL.createObjectURL(recording);
    createAudioElement(url);
  }
  recordingText.textContent = "";
});

function createAudioElement(src) {
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
  recordingEffect();
}

reverbButton.addEventListener("click", async () => {
  const reverb = new Tone.JCReverb({
    roomSize: 0.8,
    wet: 0.5,
  }).toDestination();
  applyEffect(reverb);
});

chorusButton.addEventListener("click", async () => {
  const chorusEffect = new Tone.Chorus({
    frequency: 10,
    delayTime: 0.1,
    depth: 0.9,
    spread: 180,
  }).toDestination();
  applyEffect(chorusEffect);
});

distortionButton.addEventListener("click", async () => {
  const distort = new Tone.Distortion({
    distortion: 0.8,
    saturate: 0.5,
  }).toDestination();
  applyEffect(distort);
});

delayButton.addEventListener("click", async () => {
  const delayEffect = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.6,
    wet: 0.5,
  }).toDestination();
  applyEffect(delayEffect);
});

downloadButton.addEventListener("click", () => {
  recorder.stop();

  recorder.onstop = () => {
    const audioBlob = new Blob(chunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const link = document.createElement("a");
    link.href = audioUrl;
    link.setAttribute("download", "recording.wav");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    chunks = [];
  };
});

const recordingEffect = async () => {
  const destination = Tone.context.createMediaStreamDestination();
  Tone.Master.connect(destination);
  recorder = new MediaRecorder(destination.stream);
  recorder.ondataavailable = (event) => {
    chunks.push(event.data);
  };
  recorder.start();
};
