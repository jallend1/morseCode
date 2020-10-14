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
    const prevWord = [];
    for(let i = 0; i < character.length; i++){
        prevWord.unshift(character.shift())
    }
    keysEntered.push(prevWord);
    console.log(`Charcter: ${character}`);
    console.log(`previousWord: ${prevWord}`);
    console.log(`keysEntered: ${keysEntered}`);
}

const handleKeyDown = (e) => {
    pressedAt ? prevPressedAt = pressedAt : null;
    pressedAt = Date.now();
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
}

const processLetter = (letter) => {
    if(isNewWord()){
        extractLetters();
    }
    console.log(character);
    character.push(letter);
    morse.textContent += `${letter}. `
    letter === 'dit' ? dit.play() : dah.play();
    console.log(character);
    
}

const handleKeyUp = () => {
    keyUpTime = Date.now();
    const keyPressLength = keyUpTime - pressedAt;                      // Subtracts the current time from the time when the key was initially pressed
    const letter = ditOrDah(keyPressLength);                            // Determines if dit or dah
    processLetter(letter);
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);