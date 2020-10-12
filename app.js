const morse = document.getElementById('morse');
const dit = new Audio('./audio/dit.mp3');
const dah = new Audio('./audio/dah.mp3');
let pressedAt;
let keyPressed = false;
let keyUpTime;
let sameCharacter = true;
let character ='';

const ditOrDah = keyPress => {
    if(keyPress <= 150){
        morse.innerText += 'dit. '
        dit.play();
    }
    else if(keyPress > 150){
        morse.innerText += 'dah. '
        dah.play();
    }
}

const playSound = (keyPress) => {
    morse.innerText += ditOrDah(keyPress)
}

const countSpace = () => {
    if(keyUpTime){
        console.log(pressedAt - keyUpTime)
        if(pressedAt - keyUpTime < 400){
            return true;
        }
        else{
            return false;
        }
        
    }

}

const handleKeyDown = (e) => {
    if(keyPressed === false){
        keyPressed = true;
        pressedAt = Date.now();
    }
    countSpace();
}

const handleKeyUp = (e) => {
    keyPressed = false;
    keyUpTime = Date.now();
    const keyPress = keyUpTime - pressedAt;
    console.log(keyPress);
    ditOrDah(keyPress);
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);