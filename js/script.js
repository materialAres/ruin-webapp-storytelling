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
// TODO: adjust typing speed at 60
let typingSpeed = 1;
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
            
            // Initialize puzzle after 5 seconds
            setTimeout(() => {
                initializePuzzle();
            }, 5000);
        }
        manOnChair.style.display = 'none';
        
        // Create text element instead of replacing innerHTML to preserve puzzle wrapper
        const textDiv = document.createElement('div');
        textDiv.className = 'choice-text';
        textDiv.textContent = chosenPathMessages[choice];
        choiceContainer.insertBefore(textDiv, choiceContainer.firstChild);
        
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

// Puzzle functions
function generateMainBoard() {
    const mainBoard = document.getElementById('puzzleMainBoard');
    mainBoard.innerHTML = '';
    
    for (let i = 0; i < 16; i++) {
        const dropZone = document.createElement('div');
        dropZone.className = 'puzzle-drop-zone';
        dropZone.dataset.position = i;
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
        mainBoard.appendChild(dropZone);
    }
}

function generateSelectionBoard() {
    const selectionBoard = document.getElementById('puzzleSelectionBoard');
    selectionBoard.innerHTML = '';
    
    for (let row = 0; row < 2; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'puzzle-selection-row';
        
        for (let col = 0; col < 8; col++) {
            const pieceIndex = row * 8 + col;
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.pieceId = pieceIndex;
            piece.dataset.correctPosition = pieceIndex;
            piece.style.backgroundImage = `url('./public/assets/puzzle-pieces/puzzle-piece-${pieceIndex}.jpg')`;
            piece.textContent = pieceIndex + 1; // Placeholder number
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragend', handleDragEnd);
            rowDiv.appendChild(piece);
        }
        
        selectionBoard.appendChild(rowDiv);
    }
}

function handleDragStart(e) {
    if (e.target.classList.contains('placed')) {
        e.preventDefault();
        return;
    }
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.pieceId);
    
    // Store source information for board pieces
    if (e.target.classList.contains('in-board')) {
        const dropZone = e.target.parentElement;
        e.dataTransfer.setData('sourcePosition', dropZone.dataset.position);
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!e.target.classList.contains('filled')) {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropZone = e.target;
    dropZone.classList.remove('drag-over');
    
    // Don't allow dropping on filled zones
    if (dropZone.classList.contains('filled')) {
        return;
    }
    
    const pieceId = e.dataTransfer.getData('text/plain');
    const sourcePosition = e.dataTransfer.getData('sourcePosition');
    
    // Handle piece already on board (moving between positions)
    // Check this FIRST to avoid finding the original piece in selection board
    if (sourcePosition !== '') {
        const sourceDrop = document.querySelector(`[data-position="${sourcePosition}"]`);
        const movingPiece = sourceDrop.querySelector('.puzzle-piece');
        
        if (movingPiece) {
            // Remove from old position
            sourceDrop.classList.remove('filled');
            sourceDrop.innerHTML = '';
            
            // Place in new position
            dropZone.appendChild(movingPiece);
            dropZone.classList.add('filled');
            
            // Check if puzzle is complete
            checkPuzzleComplete();
        }
    }
    // Handle piece from selection board
    else {
        const piece = document.querySelector(`[data-piece-id="${pieceId}"]`);
        if (piece && !piece.classList.contains('placed')) {
            // Clone the piece and place it in the drop zone
            const placedPiece = piece.cloneNode(true);
            placedPiece.draggable = true;
            placedPiece.classList.add('in-board');
            placedPiece.addEventListener('dragstart', handleDragStart);
            placedPiece.addEventListener('dragend', handleDragEnd);
            dropZone.appendChild(placedPiece);
            
            // Mark original as placed
            piece.classList.add('placed');
            dropZone.classList.add('filled');
            
            // Check if puzzle is complete
            checkPuzzleComplete();
        }
    }
}

function checkPuzzleComplete() {
    const dropZones = document.querySelectorAll('.puzzle-drop-zone');
    let correctCount = 0;
    
    dropZones.forEach((zone, index) => {
        const piece = zone.querySelector('.puzzle-piece');
        if (piece && parseInt(piece.dataset.correctPosition, 10) === index) {
            correctCount++;
        }
    });
    
    if (correctCount === 16) {
        onPuzzleComplete();
    }
}

function onPuzzleComplete() {
    const puzzleWrapper = document.getElementById('puzzleWrapper');
    const mainBoard = document.getElementById('puzzleMainBoard');
    
    // Play success sound
    const successSound = new Audio('./public/sounds/puzzle-complete.ogg');
    successSound.play();
    
    // Add completion visual effect
    mainBoard.classList.add('puzzle-complete');
    
    // Show completion message after 1 second
    setTimeout(() => {
        showCompletionMessage();
    }, 1000);
}

function showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'puzzle-completion-message';
    message.innerHTML = `
        <h2>Conscience Restored</h2>
        <p>The pieces fall into place...</p>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('visible');
    }, 50);
}

function initializePuzzle() {
    const choiceContainer = document.getElementById("choiceContainer");
    const puzzleWrapper = document.getElementById("puzzleWrapper");
    
    // Animate existing text up via CSS transition class
    choiceContainer.classList.add("choice-move-up");
    
    // Show puzzle after text moves
    setTimeout(() => {
        generateMainBoard();
        generateSelectionBoard();
        puzzleWrapper.style.display = "flex";
        setTimeout(() => {
            puzzleWrapper.classList.add("visible");
        }, 50);
    }, 1000);
}
