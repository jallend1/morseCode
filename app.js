//TODO: Create mechanism for final character to be translated -- setTimeout to clear out character variable?
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
let pressedAt;
let prevPressedAt;
let keyUpTime;
let sameCharacter = true;
let character = [];
let keysEntered = [];

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
    const prevWord = character.map(x => x);
    character.length = 0;
    keysEntered.push(prevWord);
}

const handleKeyDown = (e) => {
    pressedAt ? prevPressedAt = pressedAt : null;
    pressedAt = Date.now();
}

const handleKeyUp = () => {
    keyUpTime = Date.now();
    const keyPressLength = keyUpTime - pressedAt;                      // Subtracts the current time from the time when the key was initially pressed
    const key = ditOrDah(keyPressLength);                            // Determines if dit or dah
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
    console.log(isNewWord())
    if(isNewWord()){
        extractLetters();
    }
    character.push(key);
    morse.textContent += `${key}. `
    key === 'dit' ? dit.play() : dah.play();
    console.log(character);
}



window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);