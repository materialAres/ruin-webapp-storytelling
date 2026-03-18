// Puzzle module - handles all puzzle-related functionality

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
    
    // Create array of piece indices and shuffle them
    const pieceIndices = Array.from({length: 16}, (_, i) => i);
    for (let i = pieceIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieceIndices[i], pieceIndices[j]] = [pieceIndices[j], pieceIndices[i]];
    }
    
    for (let row = 0; row < 2; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'puzzle-selection-row';
        
        for (let col = 0; col < 8; col++) {
            const displayPosition = row * 8 + col;
            const pieceIndex = pieceIndices[displayPosition];
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            piece.dataset.pieceId = pieceIndex;
            piece.dataset.correctPosition = pieceIndex;
            piece.style.backgroundImage = `url('./public/assets/puzzle-pieces/puzzle-piece-${pieceIndex}.jpg')`;
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
    
    // Get the actual drop zone (in case we dropped on a piece inside it)
    let dropZone = e.target;
    if (!dropZone.classList.contains('puzzle-drop-zone')) {
        dropZone = dropZone.closest('.puzzle-drop-zone');
    }
    
    // If we couldn't find a drop zone, exit
    if (!dropZone) {
        return;
    }
    
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
        <p>The pieces fell into place and your consciousness has been restored.</p>
        <button id="continueButton" style="opacity: 0; transition: opacity 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); background: none; border: none; color: #5078b4e6; font-size: 1.2rem; cursor: pointer; padding: 20px; font-family: inherit;">Continue →</button>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('visible');
    }, 50);
    
    // Show continue button after 3 seconds
    setTimeout(() => {
        const continueBtn = document.getElementById('continueButton');
        if (continueBtn) {
            continueBtn.style.opacity = '1';
            continueBtn.addEventListener('click', onContinueClicked);
        }
    }, 3000);
}

function onContinueClicked() {
    // Clear the entire screen
    document.body.innerHTML = '';
    
    // Create container for final text
    const finalContainer = document.createElement('div');
    finalContainer.style.display = 'flex';
    finalContainer.style.justifyContent = 'center';
    finalContainer.style.alignItems = 'center';
    finalContainer.style.height = '100vh';
    finalContainer.style.padding = '40px';
    finalContainer.style.boxSizing = 'border-box';
    
    // Create text element
    const textElement = document.createElement('div');
    textElement.style.color = 'black';
    textElement.style.fontSize = '1.3rem';
    textElement.style.lineHeight = '1.8';
    textElement.style.maxWidth = '800px';
    textElement.style.textAlign = 'center';
    textElement.style.fontFamily = 'inherit';
    textElement.style.display = 'flex';
    textElement.style.flexDirection = 'column';
    textElement.style.alignItems = 'center';
    textElement.style.justifyContent = 'center';
    textElement.style.gap = '16px';
    
    // Array of paragraph texts
    const paragraphs = [
        'You reached out a hand in search of help; you exposed yourself by setting shame aside, and you received as a gift words of comfort, words that enriched your will toward a new life.',
        'It is time for you to rebuild, to restore stability to a life that once again belongs to you.',
        'Honor those who were able to listen to you; honor your own mind, which will accompany you in your ascent.',
        'If you look back, do so only to accept what has been, because yours is not an escape, nor a way to bury what once was, but a simple, though difficult, change.'
    ];
    
    // Create paragraph elements
    const pElements = [];
    paragraphs.forEach((text, index) => {
        const p = document.createElement('p');
        p.textContent = text;
        p.style.opacity = '0';
        p.style.transition = 'opacity 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        textElement.appendChild(p);
        pElements.push(p);
        
        // Fade in each paragraph
        setTimeout(() => {
            p.style.opacity = '1';
        }, index * 10000 + 50);
    });
    
    // Create "The end" text (hidden initially)
    const endText = document.createElement('div');
    endText.textContent = 'The end';
    endText.style.color = 'black';
    endText.style.fontSize = '3rem';
    endText.style.fontWeight = 'bold';
    endText.style.fontFamily = 'inherit';
    endText.style.opacity = '0';
    endText.style.transition = 'opacity 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    finalContainer.appendChild(textElement);
    document.body.appendChild(finalContainer);
    
    // After 40 seconds, vanish paragraphs like rays of light (bottom to top)
    setTimeout(() => {
        const totalParagraphs = pElements.length;
        
        pElements.forEach((p, index) => {
            // Reverse order: last paragraph vanishes first
            const reverseIndex = totalParagraphs - 1 - index;
            
            setTimeout(() => {
                p.style.transition = 'opacity 0.8s ease-out, color 0.8s ease-out, text-shadow 0.8s ease-out';
                p.style.color = 'rgba(255, 255, 255, 0.9)';
                p.style.textShadow = '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.5)';
                p.style.opacity = '0';
            }, reverseIndex * 1000);
        });
        
        // After all paragraphs vanished, show "The end"
        const vanishDuration = totalParagraphs * 1000 + 800;
        setTimeout(() => {
            textElement.style.display = 'none';
            finalContainer.appendChild(endText);
            
            setTimeout(() => {
                endText.style.opacity = '1';
            }, 50);
        }, vanishDuration);
    }, 55000);
}

export function initializePuzzle() {
    const choiceContainer = document.getElementById("choiceContainer");
    const puzzleWrapper = document.getElementById("puzzleWrapper");
    const textElement = choiceContainer.querySelector('.choice-text');
    
    if (textElement) {
        const text = textElement.textContent;
        const words = text.split(/\s+/).filter(word => word.length > 0);
        
        // Create scattered word elements
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'scattered-word';
            wordSpan.textContent = word;
            wordSpan.style.position = 'absolute';
            wordSpan.style.left = '50%';
            wordSpan.style.top = '50%';
            wordSpan.style.transform = 'translate(-50%, -50%)';
            wordSpan.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            wordSpan.style.opacity = '1';
            wordSpan.style.color = 'black';
            wordSpan.style.fontSize = '1.2rem';
            wordSpan.style.pointerEvents = 'none';
            wordSpan.style.zIndex = '100';
            document.body.appendChild(wordSpan);
            
            // Trigger explosion after a brief delay
            setTimeout(() => {
                // Calculate random position avoiding center (puzzle area)
                const angle = (index / words.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
                const distance = 450 + Math.random() * 250;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                wordSpan.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${(Math.random() - 0.5) * 720}deg)`;
                wordSpan.style.opacity = '0.3';
                wordSpan.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 0, 0, 0.2)';
            }, 50 + index * 30);
        });
        
        // Hide original text
        textElement.style.opacity = '0';
    }
    
    // Show puzzle after explosion starts
    setTimeout(() => {
        generateMainBoard();
        generateSelectionBoard();
        puzzleWrapper.style.display = "flex";
        setTimeout(() => {
            puzzleWrapper.classList.add("visible");
        }, 50);
    }, 1000);
}
