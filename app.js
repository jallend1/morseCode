const codex = {
  a: ["dit", "dah"],
  b: ["dah", "dit", "dit", "dit"],
  c: ["dah", "dit", "dah", "dit"],
  d: ["dah", "dit", "dit"],
  e: ["dit"],
  f: ["dit", "dit", "dah", "dit"],
  g: ["dah", "dah", "dit"],
  h: ["dit", "dit", "dit", "dit"],
  i: ["dit", "dit"],
  j: ["dit", "dah", "dah", "dah"],
  k: ["dah", "dit", "dah"],
  l: ["dit", "dah", "dit", "dit"],
  m: ["dah", "dah"],
  n: ["dah", "dit"],
  o: ["dah", "dah", "dah"],
  p: ["dit", "dah", "dah", "dit"],
  q: ["dah", "dah", "dit", "dah"],
  r: ["dit", "dah", "dit"],
  s: ["dit", "dit", "dit"],
  t: ["dah"],
  u: ["dit", "dit", "dah"],
  v: ["dit", "dit", "dit", "dah"],
  w: ["dit", "dah", "dah"],
  x: ["dah", "dit", "dit", "dah"],
  y: ["dah", "dit", "dah", "dah"],
  z: ["dah", "dah", "dit", "dit"],
  1: ["dit", "dah", "dah", "dah", "dah"],
  2: ["dit", "dit", "dah", "dah", "dah"],
  3: ["dit", "dit", "dit", "dah", "dah"],
  4: ["dit", "dit", "dit", "dit", "dah"],
  5: ["dit", "dit", "dit", "dit", "dit"],
  6: ["dah", "dit", "dit", "dit", "dit"],
  7: ["dah", "dah", "dit", "dit", "dit"],
  8: ["dah", "dah", "dah", "dit", "dit"],
  9: ["dah", "dah", "dah", "dah", "dit"],
  0: ["dah", "dah", "dah", "dah", "dah"],
};
const skillForm = document.getElementById("skillform");
const morse = document.getElementById("morse");
const translation = document.getElementById("translation");
const resetButton = document.getElementById("reset");
const morseReference = document.getElementById("morse-reference");
const dit = new Audio("./audio/dit.mp3");
const dah = new Audio("./audio/dah.mp3");
let ditLength = 200;
let newCharTimeout;
let newWordTimeout;
let pressedAt;
let prevPressedAt;
let keyUpTime;
let character = [];
let keysEntered = [];
let letters = "";
let skillLevel = "beginner";

const changeSkill = (e) => {
  skillLevel = e.target.value;
  if (e.target.value === "beginner") {
    ditLength === 200;
  } else if (e.target.value === "intermediate") {
    ditLength === 150;
  } else if (e.target.value === "advanced") {
    ditLength === 100;
  }
};

const clearSounds = () => {
  // Stops previous sound when new sound gets rockin
  dit.pause();
  dah.pause();
  dit.currentTime = 0;
  dah.currentTime = 0;
};

// Calculates if length of keypress creates a dit or a dah
const ditOrDah = (keyPress) => {
  return keyPress <= ditLength ? "dit" : "dah";
};

const convertMorseToLetter = (prevWord) => {
  const morseKeys = Object.keys(codex);
  const incomingLetters = letters;
  morseKeys.forEach((key) => {
    if (codex[key].length === prevWord.length) {
      // Skips letters of different lengths
      codex[key].every((value, index) => value === prevWord[index])
        ? (letters += key)
        : null;
    }
  });
  // If letters remains unchanged, adds question mark for unrecognized character
  if (letters === incomingLetters) letters += "?";
  translation.textContent = letters;
};
const extractLetter = () => {
  if (character.length) {
    // Prevents timeout function from pushing an empty array
    const prevWord = character.map((x) => x);
    character.length = 0;
    keysEntered.push(prevWord);
    convertMorseToLetter(prevWord);
  }
};

const handleKeyDown = (e) => {
  if (e.keyCode === 32) {
    newCharTimeout ? window.clearTimeout(newCharTimeout) : null;
    newWordTimeout ? window.clearTimeout(newWordTimeout) : null;
    pressedAt ? (prevPressedAt = pressedAt) : null;
    pressedAt = Date.now();
  }
};

const handleKeyUp = (e) => {
  if (e.keyCode === 32) {
    keyUpTime = Date.now();
    const keyPressLength = keyUpTime - pressedAt; // Subtracts the current time from the time when the key was initially pressed
    const key = ditOrDah(keyPressLength); // Determines if dit or dah
    newCharTimeout = window.setTimeout(extractLetter, ditLength * 3); // Sets timeout to process keypress in case it's the final one entered;
    newWordTimeout = window.setTimeout(() => (letters += " "), ditLength * 7);
    processLetter(key);
  }
};

const isNewLetter = () => {
  if (prevPressedAt) {
    // Only runs if there is a previous character that established a comparison time
    return keyUpTime - prevPressedAt < ditLength * 4 ? false : true;
  } else {
    return false;
  }
};

const processLetter = (key) => {
  if (isNewLetter()) {
    extractLetter();
  }
  character.push(key);
  if (morse.textContent === "Press a key to start rockin") {
    morse.textContent = `${key}. `;
    translation.textContent = "...calculating";
  } else {
    morse.textContent += `${key}. `;
  }
  clearSounds();
  key === "dit" ? dit.play() : dah.play();
};

const resetPage = () => {
  letters = "";
  keysEntered.length = 0;
  morse.textContent = "Press a key to start rockin";
  translation.textContent = "Press a key to start rockin";
};

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
resetButton.addEventListener("click", resetPage);
skillForm.addEventListener("click", changeSkill);

Object.keys(codex).forEach((morse) => {
  morseReference.innerHTML += `
    <tr>
      <td>${morse}:</td> 
      <td>${codex[morse]}</td>
    </tr>
    `;
});
