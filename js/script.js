// Story texts for each word
const wordTexts = {
    curse: "It feels like chasing a world without the bare idea of when you'll stop. Could you do that? Could you quell the anger, look beyond, and see what it means to live?<br><br>Take this <span class='clickable-key' id='basementKey'>key</span>: keep it safe for the moment you want to face this torture.",
    begin: "Watch the first step, the heavier, how it falls under this feeble ground. You notice the impending danger within your skin but you cannot save yourself.<br><br>So that's the beginning, that's the road with no lead you're eager to take.",
    trail: "The smell of mud draws this path, the sense of fear is its spouse. Will you find a better premise? Will you be caught in the endless cycle?<br><br>That's the body and that's your ruin, knock on the door and see who <span class='clickable-listens' id='listensWord'>listens</span>."
};

const manMessages = [
    "Leave me alone… for this life is not meant to be continued.",
    "Your entire existence, cursed from the beginning of its trail.",
    "You didn't have the right to do so but here we are.",
    "It's cold and useless this night, inhaling again this substance without matter, which crumbles my being and shuts off my essence.",
];

const chosenPathMessages = {
    sleep: "Witnessing your nightmares as if you were sitting in a theatre… They traverse your lungs, they touch your secrets and show your real sufferings. But are you capable of facing them when you wake up? Will you be able to cry?",
    restore: "Fragments of life scattered on the floor, make them fit and overcome your dreads. It's never too late if you are willing to withstand the events.",
    continue: "Between the margins of your consciousness you hear nothing, you don't want to look into it. And so it is, seclude yourself in another night where you cannot even whisper, inhale and ride the decay."
};

let intro = null;
let heartbeat = null;
let rust = null;

const manWordsContainer = document.getElementById('typewriter');
let typingSpeed = 60;
let messageIndex = 0;
let charIndex = 0;
let typingTimer = null;

// Inventory management
const inventory = {
    items: [],
    
    init() {
        const saved = JSON.parse(sessionStorage.getItem('inventory') || '[]');
        this.items = saved;
    },
    
    add(item) {
        if (!this.items.includes(item)) {
            this.items.push(item);
            this.save();
            return true;
        }
        return false;
    },
    
    has(item) {
        return this.items.includes(item);
    },
    
    save() {
        sessionStorage.setItem('inventory', JSON.stringify(this.items));
    }
};

function destroyAudio(sound) {
  sound.pause();
  sound.src = "";
  sound.load();
  sound = null;
}

// Initialize inventory
inventory.init();

// Start button handler
document.getElementById('startButton').addEventListener('click', () => {
    const button = document.getElementById('startButton');
    const wordsContainer = document.getElementById('wordsContainer');
    wordsContainer.style.display = 'block';
    intro = new Audio('./public/sounds/echoes.ogg');
    intro.loop = true;
    
    button.classList.add('fade-out');
    
    setTimeout(() => {
        wordsContainer.classList.add('visible');
        document.getElementById('curse').classList.add('show');
        document.getElementById('begin').classList.add('show');
        document.getElementById('trail').classList.add('show');
        intro.play();
    }, 500);
});

// Word click handler
function showWordText(wordKey) {
    const buttonClickSound = new Audio('./public/sounds/button-clicked.ogg');
    const wordsContainer = document.getElementById('wordsContainer');
    const textContainer = document.getElementById('textContainer');
    const textContent = document.getElementById('textContent');

    textContainer.style.display = 'flex';
    
    // Fade out words
    wordsContainer.classList.add('fade-out');
    buttonClickSound.play();
    
    // Show text after words fade
    setTimeout(() => {
        wordsContainer.style.display = 'none';
        textContent.innerHTML = wordTexts[wordKey];
        textContainer.classList.add('visible');
        
        // Add key click handler if this is the curse text
        if (wordKey === 'curse') {
            const keyElement = document.getElementById('basementKey');
            if (keyElement) {
                // Check if already collected
                if (inventory.has('Basement Key')) {
                    keyElement.classList.add('collected');
                } else {
                    keyElement.addEventListener('click', collectKey);
                }
            }
        }
        
        // Add listens click handler if this is the trail text
        if (wordKey === 'trail') {
            const listensElement = document.getElementById('listensWord');
            if (listensElement) {
                listensElement.addEventListener('click', tryGoToDoor);
            }
        }
    }, 1000);
}

// Collect key handler
function collectKey(e) {
    const added = inventory.add('Basement Key');
    if (added) {
        e.target.classList.add('collected');
        
        // Show obtained message
        const message = document.createElement('div');
        message.className = 'item-obtained';
        message.textContent = 'Obtained Basement Key';
        document.body.appendChild(message);
        
        // Remove message after animation
        setTimeout(() => {
            message.remove();
        }, 2000);
        
        console.log('Basement Key collected!');
        console.log('Current inventory:', inventory.items);
    }
}

// Try to open door handler
function tryGoToDoor() {
    if (inventory.has('Basement Key')) {
        // Player has the key, show door
        const textContainer = document.getElementById('textContainer');
        const doorScreen = document.getElementById('doorScreen');
        
        textContainer.classList.remove('visible');
        
        setTimeout(() => {
            doorScreen.classList.add('visible');
            doorScreen.style.display = 'flex';
            destroyAudio(intro);
            heartbeat = new Audio('./public/sounds/heart-beat.ogg');
            heartbeat.loop = true;
            heartbeat.play();
        }, 1000);
    } else {
        // Player doesn't have the key, show error
        const message = document.createElement('div');
        message.className = 'error-message';
        message.textContent = 'You need a key for this';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
}

function openDoor() {
    const doorScreen = document.getElementById('doorScreen');
    const manOnChair = document.getElementById('manOnChair');
    doorScreen.classList.remove('visible');
    destroyAudio(heartbeat);
    const unlockDoor = new Audio('./public/sounds/unlock.ogg');
    unlockDoor.play();
                
    setTimeout(() => {
      rust = new Audio('./public/sounds/rust.ogg');
      rust.play();
      // Reset typewriter state and clear container so typing starts fresh
      manWordsContainer.textContent = '';
      messageIndex = 0;
      charIndex = 0;
      if (typingTimer) {
          clearTimeout(typingTimer);
          typingTimer = null;
      }

      manOnChair.classList.add('visible');
      manOnChair.style.display = 'flex';
      typeWriter();
    }, 1000);
}

// Expose openDoor to global scope for inline onclick handler
window.openDoor = openDoor;

// Add click handlers to all words
document.querySelectorAll('.word').forEach(word => {
    word.addEventListener('click', (e) => {
        const wordKey = e.target.dataset.word;
        showWordText(wordKey);
    });
});

function typeWriter() {
    if (messageIndex >= manMessages.length) {
        manWordsContainer.classList.add('finished');
        return;
    }

    const current = manMessages[messageIndex];

    if (charIndex < current.length) {
        manWordsContainer.textContent += current.charAt(charIndex);
        charIndex++;
        typingTimer = setTimeout(typeWriter, typingSpeed);
    } else {
        // End of current message: add spacing and move to next
        messageIndex++;
        charIndex = 0;

        if (messageIndex < manMessages.length) {
            manWordsContainer.textContent += '\n\n';
            typingTimer = setTimeout(typeWriter, 700);
        } else {
            manWordsContainer.classList.add('finished');
            enableManChoices();
        }
    }
}

function enableManChoices() {
    const chooseDiv = document.getElementById('choose');
    chooseDiv.classList.add('visible');

    // add three options as clickable spans
    chooseDiv.innerHTML = `
        <span class="choice" id="sleep">Sleep</span>
        <span class="choice" id="restore">Restore</span>
        <span class="choice" id="continue">Continue</span>
    `;

    // Add event listeners for choices
    document.getElementById('sleep').addEventListener('click', () => {
        showChoice('sleep');
    });
    document.getElementById('restore').addEventListener('click', () => {
        showChoice('restore');
    });
    document.getElementById('continue').addEventListener('click', () => {
        showChoice('continue');
    });
}

function showChoice(choice) {
    const buttonClickSound = new Audio('./public/sounds/button-clicked.ogg');
    const manOnChair = document.getElementById('manOnChair');
    const choiceContainer = document.getElementById('choiceContainer');
    
    // Fade out words
    manOnChair.classList.add('fade-out');
    buttonClickSound.play();
    
    // Show text after words fade
    setTimeout(() => {
        if (choice === 'restore') {
            document.body.style.backgroundColor = 'white';
            choiceContainer.style.color = 'black';
        }
        manOnChair.style.display = 'none';
        choiceContainer.innerHTML = chosenPathMessages[choice];
        choiceContainer.classList.add('visible');
    }, 1000);
}

// Back button handler
document.getElementById('backButton').addEventListener('click', () => {
    const textContainer = document.getElementById('textContainer');
    const wordsContainer = document.getElementById('wordsContainer');
    
    // Fade out text
    textContainer.classList.remove('visible');
    
    // Show words again after text fades
    setTimeout(() => {
        wordsContainer.style.display = '';
        wordsContainer.classList.remove('fade-out');
        wordsContainer.classList.add('visible');
        wordsContainer.style.display = 'flex';
    }, 1000);
});