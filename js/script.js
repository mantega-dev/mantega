const dynamicWords = ["coding", "design", "photography", "geography", "languages", "pets"];
let wordIndex = 0;

const dynamicWordElement = document.getElementById("dynamic-word");

function revealWord() {
    const word = dynamicWords[wordIndex];
    const letters = word.split("");
    let index = 0;

    dynamicWordElement.textContent = "";

    const revealTimer = setInterval(() => {
        if (index >= letters.length) {
            clearInterval(revealTimer);
            setTimeout(hideWord, 1000);
        } else {
            dynamicWordElement.textContent += letters[index];
            index++;
        }
    }, 150);
}

function hideWord() {
    const letters = dynamicWordElement.textContent.split("");
    let index = letters.length - 1;

    const hideTimer = setInterval(() => {
        if (index < 0) {
            clearInterval(hideTimer);
            wordIndex = (wordIndex + 1) % dynamicWords.length;
            setTimeout(revealWord, 1000);
        } else {
            letters.splice(index, 1);
            dynamicWordElement.textContent = letters.join("");
            index--;
        }
    }, 150);
}

revealWord();

const opacityDivs = document.querySelectorAll(".opacity-div");
