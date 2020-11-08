import { codex } from "./morse.js";

const skillForm = document.getElementById("skillform");
const morse = document.getElementById("morse");
const translation = document.getElementById("translation");
const resetButton = document.getElementById("reset");
const morseReference = document.getElementById("morse-reference");
const dit = new Audio("./audio/dit.mp3");
const dah = new Audio("./audio/dah.mp3");
let ditLength = 150;
let newCharTimeout;
let newWordTimeout;
let pressedAt;
let prevPressedAt;
let keyUpTime;
let character = [];
let keysEntered = [];
let letters = "";

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
  // e.repeat makes sure it fires only for the first keydown event
  if (!e.repeat) {
    newCharTimeout ? window.clearTimeout(newCharTimeout) : null;
    newWordTimeout ? window.clearTimeout(newWordTimeout) : null;
    pressedAt ? (prevPressedAt = pressedAt) : null;
    pressedAt = Date.now();
  }
};

const handleKeyUp = (e) => {
  keyUpTime = Date.now();
  const keyPressLength = keyUpTime - pressedAt; // Subtracts the current time from the time when the key was initially pressed
  const key = ditOrDah(keyPressLength); // Determines if dit or dah
  newCharTimeout = window.setTimeout(extractLetter, ditLength * 10); // Sets timeout to process keypress in case it's the final one entered;
  newWordTimeout = window.setTimeout(() => (letters += " "), ditLength * 15);
  processLetter(key);
};

const isNewLetter = () => {
  if (prevPressedAt) {
    // Only runs if there is a previous character that established a comparison time
    return keyUpTime - prevPressedAt > ditLength * 7;
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

// Renders morse codex to page
const renderMorse = () => {
  Object.keys(codex).forEach((morse) => {
    morseReference.innerHTML += `
    <div class="character-id">
      <span class="letter">${morse.toUpperCase()}:</span> <span>${codex[morse]}</span>
    </div>
    `;
  });
}

const resetPage = () => {
  letters = "";
  keysEntered.length = 0;
  morse.textContent = "Press a key to start rockin";
  translation.textContent = "(You haven't entered anything yet)";
};

renderMorse();

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
resetButton.addEventListener("click", resetPage);