import * as Tone from "tone";
import * as scribble from "scribbletune";

let currentPart = null;

async function playPattern(patternName) {
  await Tone.start();

  if (currentPart) {
    currentPart.stop();
    currentPart.dispose();
    currentPart = null;
  }
  Tone.Transport.stop();
  Tone.Transport.cancel();

  const reverb = new Tone.Reverb(2).toDestination();
  const synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 1 },
  }).connect(reverb);

  let clip;
  let bpm = 90;

  switch (patternName) {
    case "techno":
    clip = scribble.clip({
      notes: ["C2", "G2", "C2", "F2", "D2", "A2", "C2", "F2", "G2", "C3", "D2", "G2"],
      pattern: "x-x-x-x-x-x-x-x-",
    });
    bpm = 130;
    break;

  case "jazz":
    clip = scribble.clip({
    notes: [
      "C4", "E4", "G4", "Bb4",  
      "D4", "F4", "A4", "C5",   
      "G3", "B3", "D4", "F4",   
      "C4", "E4", "G4", "Bb4"   
    ],
    pattern: "x_xx__x_xx__x_",
  });
  bpm = 100;
  break;

  case "lofi":
    clip = scribble.clip({
      notes: ["A3", "B3", "C4", "E4", "G4", "A4", "B3", "C4", "D4", "E4", "F4", "G4"],
      pattern: "x--x-x--x-x--",
    });
    bpm = 85;
    break;
    default:
      return;
  }

  const events = [];
  for (let i = 0; i < clip.length; i++) {
    const noteObj = clip[i];
    const note =
      typeof noteObj === "string"
        ? noteObj
        : Array.isArray(noteObj.note)
        ? noteObj.note[0]
        : noteObj.note || "x";

    if (note && note !== "x") {
      events.push([i * 0.5, note]); 
    }
  }

  
  currentPart = new Tone.Part((time, note) => {
    synth.triggerAttackRelease(note, "8n", time);
  }, events).start(0);

  Tone.Transport.bpm.value = bpm;
  Tone.Transport.start();
  console.log(`Carregado padrão: ${patternName}`);
}

// listeners dos botões
document.getElementById("techno").addEventListener("click", () => playPattern("techno"));
document.getElementById("jazz").addEventListener("click", () => playPattern("jazz"));
document.getElementById("lofi").addEventListener("click", () => playPattern("lofi"));
