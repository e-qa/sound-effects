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

let player;
let currentEffect = null;
let recorder;
let chunks = [];

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
    try {
      const recording = await recorder.stop();
      if (recording instanceof Blob) {
        const url = URL.createObjectURL(recording);
        createAudioEL(url);
        audio.addEventListener("ended", () => {
          URL.revokeObjectURL(url);
        });
      } else {
        console.error("Recorder.stop() did not return a Blob");
      }
    } catch (error) {
      console.error("Error stopping recorder:", error);
    }
    recording.textContent = "";
  }
});

function createAudioEL(src) {
  const audio = document.createElement("audio");
  audio.src = src;
  audio.controls = true;
  player = new Tone.Player(src).toDestination();
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

reverb.addEventListener("click", () => {
  const reverb = new Tone.JCReverb({
    roomSize: 0.8,
    wet: 0.5,
  }).toDestination();
  applyEffect(reverb);
});

chorus.addEventListener("click", () => {
  const chorusEffect = new Tone.Chorus({
    frequency: 10,
    delayTime: 0.1,
    depth: 0.9,
    spread: 180,
  }).toDestination();
  applyEffect(chorusEffect);
});

distortion.addEventListener("click", () => {
  const distort = new Tone.Distortion({
    distortion: 0.8,
    saturate: 0.5,
  }).toDestination();
  applyEffect(distort);
});

delay.addEventListener("click", () => {
  const delayEffect = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.6,
    wet: 0.5,
  }).toDestination();
  applyEffect(delayEffect);
});

download.addEventListener("click", () => {
  if (recorder) {
    recorder.stop();
    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "recording.wav";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      chunks = [];
    };
  } else {
    console.log("Recorder not started or already stopped.");
  }
});

const recordingEffect = () => {
  const destination = Tone.context.createMediaStreamDestination();
  Tone.Master.connect(destination);
  recorder = new MediaRecorder(destination.stream);
  recorder.ondataavailable = (event) => {
    chunks.push(event.data);
  };
  recorder.start();
};
