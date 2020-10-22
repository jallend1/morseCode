const codex = {
    a: ['dit', 'dah'],
    b: ['dah', 'dit', 'dit', 'dit'],
    c: ['dah', 'dit','dah', 'dit'],
    d: ['dah', 'dit', 'dit'],
    e: ['dit'],
    f: ['dit', 'dit', 'dah', 'dit'],
    g: ['dah', 'dah', 'dit'],
    h: ['dit', 'dit', 'dit', 'dit'],
    i: ['dit', 'dit'],
    j: ['dit', 'dah', 'dah', 'dah'],
    k: ['dah', 'dit', 'dah'],
    l: ['dit', 'dah', 'dit', 'dit'],
    m: ['dah', 'dah'],
    n: ['dah', 'dit'],
    o: ['dah','dah','dah'],
    p: ['dit', 'dah','dah', 'dit'],
    q: ['dah','dah','dit','dah'],
    r: ['dit','dah', 'dit'],
    s: ['dit', 'dit', 'dit'],
    t: ['dah'],
    u: ['dit', 'dit', 'dah'],
    v: ['dit', 'dit', 'dit','dah'],
    w: ['dit', 'dah','dah'],
    x: ['dah', 'dit', 'dit','dah'],
    y: ['dah', 'dit', 'dah','dah'],
    z: ['dah', 'dah', 'dit', 'dit'],
    1: ['dit', 'dah', 'dah', 'dah', 'dah'],
    2: ['dit', 'dit', 'dah', 'dah', 'dah'],
    3: ['dit', 'dit', 'dit', 'dah', 'dah'],
    4: ['dit', 'dit', 'dit', 'dit', 'dah'],
    5: ['dit', 'dit', 'dit', 'dit', 'dit'],
    6: ['dah', 'dit', 'dit', 'dit', 'dit'],
    7: ['dah', 'dah', 'dit', 'dit', 'dit'],
    8: ['dah', 'dah', 'dah', 'dit', 'dit'],
    9: ['dah', 'dah', 'dah', 'dah', 'dit'],
    0: ['dah', 'dah', 'dah', 'dah', 'dah']
}
const morse = document.getElementById('morse');
const translation = document.getElementById('translation');
const resetButton = document.getElementById('reset');
const dit = new Audio('./audio/dit.mp3');
const dah = new Audio('./audio/dah.mp3');
let newCharTimeout;
let newWordTimeout;
let pressedAt;
let prevPressedAt;
let keyUpTime;
let sameCharacter = true;
let character = [];
let keysEntered = [];
let letters = '';

const ditOrDah = keyPress => {                      // Calculates if length of keypress creates a dit or a dah
    return keyPress <= 150 ? 'dit' : 'dah';                
}

const convertMorseToLetter = (prevWord) => {
    const morseKeys = Object.keys(codex);
    const incomingLetters = letters;
    morseKeys.forEach(key => {
        if(codex[key].length === prevWord.length){                                                      // Skips letters of different lengths
            codex[key].every((value, index) => value === prevWord[index]) ? letters += key : null;
        }
    })
    if(letters === incomingLetters) letters += '?';                 // If letters remains unchanged, adds question mark for unrecognized character
    translation.textContent = letters;
}
const extractLetter = () => {
    if(character.length){                           // Prevents timeout function from pushing an empty array 
        const prevWord = character.map(x => x);
        character.length = 0;
        keysEntered.push(prevWord);
        convertMorseToLetter(prevWord);
    }
}

const handleKeyDown = (e) => {
    newCharTimeout ? window.clearTimeout(newCharTimeout) : null;
    newWordTimeout ? window.clearTimeout(newWordTimeout) : null;
    pressedAt ? prevPressedAt = pressedAt : null;
    pressedAt = Date.now();
}

const handleKeyUp = () => {
    keyUpTime = Date.now();
    const keyPressLength = keyUpTime - pressedAt;                       // Subtracts the current time from the time when the key was initially pressed
    const key = ditOrDah(keyPressLength);                               // Determines if dit or dah
    newCharTimeout = window.setTimeout(extractLetter, 1100)             // Sets timeout to process keypress in case it's the final one entered;
    newWordTimeout = window.setTimeout(() => letters += ' ', 2000)
    processLetter(key);
}

const isNewLetter = () => {
    if(prevPressedAt){                                      // Only runs if there is a previous character that established a comparison time
        return (keyUpTime - prevPressedAt < 1000 ? false : true)
    }
    else{
        return false;
    }
}

const processLetter = (key) => {
    if(isNewLetter()){
        extractLetter();
    }
    character.push(key);
    if(morse.textContent === 'Press a key to start rockin'){
        morse.textContent = `${key}. `;
        translation.textContent = '...calculating'
    }
    else{
        morse.textContent += `${key}. `
    }
    key === 'dit' ? dit.play() : dah.play();
}

const resetPage = () => {
    letters = '';
    keysEntered.length = 0;
    morse.textContent = 'Press a key to start rockin';
    translation.textContent = 'Press a key to start rockin';
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
resetButton.addEventListener('click', resetPage);