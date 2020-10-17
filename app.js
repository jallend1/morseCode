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
    z: ['dah', 'dah', 'dit', 'dit']
}

const morse = document.getElementById('morse');
const dit = new Audio('./audio/dit.mp3');
const dah = new Audio('./audio/dah.mp3');
let keyUpTimeout;
let pressedAt;
let prevPressedAt;
let keyUpTime;
let sameCharacter = true;
let character = [];
let keysEntered = [];

const checkForPause = () => {                       // Called in timeout function on keyUp events to push the final character into the array
    extractLetters();
}

const ditOrDah = keyPress => {                      // Calculates if length of keypress creates a dit or a dah
    if(keyPress <= 150){
        return 'dit'
    }
    else{
        return 'dah'
    }
    // Why doesn't this work?!
    keyPress <= 150 ? 'dit' : 'dah';                
}

const extractLetters = () => {
    if(character.length){                           // Prevents timeout function from pushing an empty array 
        const prevWord = character.map(x => x);
        console.log(prevWord)
        character.length = 0;
        keysEntered.push(prevWord);
    }
}

const handleKeyDown = (e) => {
    keyUpTimeout ? window.clearTimeout(keyUpTimeout) : null;
    pressedAt ? prevPressedAt = pressedAt : null;
    pressedAt = Date.now();
}

const handleKeyUp = () => {
    keyUpTime = Date.now();
    const keyPressLength = keyUpTime - pressedAt;                       // Subtracts the current time from the time when the key was initially pressed
    const key = ditOrDah(keyPressLength);                               // Determines if dit or dah
    keyUpTimeout = window.setTimeout(() => checkForPause(key), 1100)    // Sets timeout to process keypress in case it's the final one entered
    processLetter(key);
}

const isNewWord = () => {
    if(prevPressedAt){                                      // Only runs if there is a previous character that established a comparison time
        if(keyUpTime - prevPressedAt < 1000){
            return false;
        }
        else{
            return true;
        }
    }
    else{
        return false;
    }
}

const processLetter = (key) => {
    if(isNewWord()){
        extractLetters();
    }
    character.push(key);
    morse.textContent += `${key}. `
    key === 'dit' ? dit.play() : dah.play();
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);