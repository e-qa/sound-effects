const record = document.getElementById("record");
const stopRecord = document.getElementById("stop-record");
const playback = document.getElementById("playback");
const download = document.getElementById("download");
const container = document.getElementById("container");
const userMedia = new Tone.UserMedia();

let recorder;

record.addEventListener("click", async () => {
  await userMedia.open();
  recorder = new Tone.Recorder();
  userMedia.connect(recorder);
  startRecording();
});

function startRecording() {
  recorder.start();
}

stopRecord.addEventListener("click", async () => {
  if (recorder) {
    const recording = await recorder.stop();
    const url = URL.createObjectURL(recording);
    createAudioEL(url);
  }
});

function createAudioEL(src) {
  const audio = document.createElement("audio");
  audio.src = src;
  audio.controls = true;
  container.append(audio);
}
