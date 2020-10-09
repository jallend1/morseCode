const morse = document.getElementById('morse');
const dit = new Audio('./audio/dit.mp3');
const dah = new Audio('./audio/dah.mp3');
let pressedAt = '';
let keyPressed = false;
console.dir(morse);

const ditOrDah = keyPress => {
    if(keyPress <= 150){
        morse.innerText = 'dit.'
        dit.play();

    }
    if(keyPress > 150){
        morse.innerText = 'dah.'
        dah.play();
    }
}

const handleKeyDown = (e) => {
    if(keyPressed === false){
        keyPressed = true;
        pressedAt = Date.now();
    }
}

const handleKeyUp = (e) => {
    keyPressed = false;
    const currentTime = Date.now();
    const keyPress = currentTime - pressedAt;
    console.log(keyPress);
    ditOrDah(keyPress);
}


window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);