# Puzzle Game Implementation - Microtask Breakdown

## Overview
Implement a 4x4 puzzle game that appears in the `choiceContainer` when the user selects "restore". The puzzle represents recomposing the protagonist's conscience with an eerie yet hopeful aesthetic.

## Design Requirements
- **Timing**: Puzzle appears 5 seconds after "restore" choice is displayed
- **Layout**: 
  - Main board: 4x4 grid (16 pieces)
  - Selection board: 2 rows × 8 pieces (16 pieces total)
- **Interaction**: Drag and drop from selection board to main board
- **Visual Style**: Heavenly tones, floating animations, eerie but hopeful
- **Images**: Use placeholders initially, code ready for real images

---

## Task 1: Create HTML Structure for Puzzle Container
**File**: `index.html`

Add the puzzle container structure inside the existing `choiceContainer` div (after line 35).

```html
<div class="puzzle-wrapper" id="puzzleWrapper">
    <div class="puzzle-main-board" id="puzzleMainBoard">
        <!-- 16 drop zones (4x4 grid) -->
    </div>
    <div class="puzzle-selection-board" id="puzzleSelectionBoard">
        <!-- 16 draggable pieces (2 rows × 8 pieces) -->
    </div>
</div>
```

**Acceptance Criteria**:
- Puzzle wrapper has unique ID
- Main board and selection board are separate divs
- Structure is inside choiceContainer

---

## Task 2: Generate Main Board Grid HTML
**File**: `js/script.js`

Create a function that generates 16 drop zones for the 4×4 grid.

```javascript
function generateMainBoard() {
    const mainBoard = document.getElementById('puzzleMainBoard');
    mainBoard.innerHTML = '';
    
    for (let i = 0; i < 16; i++) {
        const dropZone = document.createElement('div');
        dropZone.className = 'puzzle-drop-zone';
        dropZone.dataset.position = i;
        mainBoard.appendChild(dropZone);
    }
}
```

**Acceptance Criteria**:
- Function creates exactly 16 drop zones
- Each zone has `puzzle-drop-zone` class
- Each zone has unique `data-position` attribute (0-15)
- Function can be called to reset the board

---

## Task 3: Generate Selection Board Pieces HTML
**File**: `js/script.js`

Create a function that generates 16 draggable puzzle pieces in 2 rows.

```javascript
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
            piece.style.backgroundImage = `url('./public/assets/puzzle-piece-${pieceIndex}.png')`;
            piece.textContent = pieceIndex + 1; // Placeholder number
            rowDiv.appendChild(piece);
        }
        
        selectionBoard.appendChild(rowDiv);
    }
}
```

**Acceptance Criteria**:
- Creates 2 rows with 8 pieces each
- Each piece has `draggable="true"`
- Each piece has unique `data-piece-id` (0-15)
- Each piece has `data-correct-position` attribute
- Placeholder numbers visible (1-16)
- Background image path ready for real images

---

## Task 4: Add Basic Puzzle CSS Structure
**File**: `style/style.css`

Add basic layout styles for puzzle wrapper and boards.

```css
.puzzle-wrapper {
    display: none;
    flex-direction: column;
    gap: 40px;
    margin-top: 40px;
    padding: 30px;
    opacity: 0;
}

.puzzle-wrapper.visible {
    opacity: 1;
    transition: opacity 1s ease-in-out;
}

.puzzle-main-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 8px;
    width: 400px;
    height: 400px;
    margin: 0 auto;
}

.puzzle-selection-board {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

.puzzle-selection-row {
    display: flex;
    justify-content: center;
    gap: 12px;
}
```

**Acceptance Criteria**:
- Puzzle wrapper hidden by default
- Main board is perfect 4×4 grid
- Selection board displays 2 rows
- Proper spacing between elements

---

## Task 5: Style Drop Zones
**File**: `style/style.css`

Add styles for the drop zones on the main board.

```css
.puzzle-drop-zone {
    width: 90px;
    height: 90px;
    border: 2px dashed rgba(200, 220, 255, 0.3);
    border-radius: 8px;
    background: rgba(150, 170, 220, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
}

.puzzle-drop-zone.drag-over {
    border-color: rgba(220, 240, 255, 0.8);
    background: rgba(180, 200, 240, 0.2);
    box-shadow: 0 0 20px rgba(200, 220, 255, 0.4);
}

.puzzle-drop-zone.filled {
    border-color: rgba(180, 220, 255, 0.6);
    background: rgba(160, 190, 230, 0.1);
}
```

**Acceptance Criteria**:
- Drop zones have dashed borders with heavenly blue tones
- Hover effect with `drag-over` class
- Filled state with `filled` class
- Smooth transitions

---

## Task 6: Style Puzzle Pieces with Heavenly Aesthetic
**File**: `style/style.css`

Add styles for draggable puzzle pieces with floating effect.

```css
.puzzle-piece {
    width: 80px;
    height: 80px;
    border: 2px solid rgba(220, 240, 255, 0.6);
    border-radius: 10px;
    background: linear-gradient(135deg, 
        rgba(200, 220, 255, 0.3) 0%, 
        rgba(180, 210, 250, 0.2) 100%);
    box-shadow: 
        0 4px 15px rgba(150, 200, 255, 0.3),
        inset 0 1px 3px rgba(255, 255, 255, 0.4);
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: rgba(220, 240, 255, 0.9);
    font-weight: bold;
    transition: all 0.3s ease;
    background-size: cover;
    background-position: center;
}

.puzzle-piece:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 
        0 8px 25px rgba(170, 210, 255, 0.5),
        inset 0 1px 5px rgba(255, 255, 255, 0.6);
}

.puzzle-piece:active {
    cursor: grabbing;
    transform: scale(0.95);
}

.puzzle-piece.placed {
    cursor: default;
    opacity: 0.5;
}
```

**Acceptance Criteria**:
- Heavenly gradient with blue/white tones
- Glowing box shadow effect
- Hover and active states
- Smooth transitions
- Placed pieces have reduced opacity

---

## Task 7: Add Floating Animations to Puzzle Pieces
**File**: `style/animations.css`

Create staggered floating animations for selection board pieces.

```css
.puzzle-piece {
    animation: gentleFloat 3s ease-in-out infinite;
}

.puzzle-piece:nth-child(1) { animation-delay: 0s; }
.puzzle-piece:nth-child(2) { animation-delay: 0.2s; }
.puzzle-piece:nth-child(3) { animation-delay: 0.4s; }
.puzzle-piece:nth-child(4) { animation-delay: 0.6s; }
.puzzle-piece:nth-child(5) { animation-delay: 0.8s; }
.puzzle-piece:nth-child(6) { animation-delay: 1s; }
.puzzle-piece:nth-child(7) { animation-delay: 1.2s; }
.puzzle-piece:nth-child(8) { animation-delay: 1.4s; }

@keyframes gentleFloat {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-8px);
    }
}
```

**Acceptance Criteria**:
- Gentle up/down floating motion
- Each piece has staggered delay
- Animation loops infinitely
- Smooth, ethereal feel

---

## Task 8: Initialize Puzzle in showChoice Function
**File**: `js/script.js`

Modify the `showChoice` function to initialize puzzle after 5 seconds when choice is "restore".

```javascript
// Add to the end of showChoice function, inside the setTimeout after 'restore' check
if (choice === 'restore') {
    document.body.style.backgroundColor = 'white';
    choiceContainer.style.color = 'black';
    
    // Initialize puzzle after 5 seconds
    setTimeout(() => {
        initializePuzzle();
    }, 5000);
}
```

**Acceptance Criteria**:
- Puzzle initializes only for "restore" choice
- 5-second delay before initialization
- Doesn't affect other choices

---

## Task 9: Create Puzzle Initialization Function
**File**: `js/script.js`

Create the main initialization function that sets up the puzzle.

```javascript
function initializePuzzle() {
    const choiceContainer = document.getElementById('choiceContainer');
    const puzzleWrapper = document.getElementById('puzzleWrapper');
    
    // Animate existing text up
    choiceContainer.style.transition = 'transform 1s ease-out';
    choiceContainer.style.transform = 'translateY(-20px)';
    
    // Show puzzle after text moves
    setTimeout(() => {
        generateMainBoard();
        generateSelectionBoard();
        puzzleWrapper.style.display = 'flex';
        setTimeout(() => {
            puzzleWrapper.classList.add('visible');
        }, 50);
    }, 1000);
}
```

**Acceptance Criteria**:
- Text animates upward smoothly
- Puzzle boards are generated
- Puzzle fades in after text animation
- Timing is smooth and sequential

---

## Task 10: Implement Drag Start Handler
**File**: `js/script.js`

Add event listener for when user starts dragging a piece.

```javascript
function handleDragStart(e) {
    if (e.target.classList.contains('placed')) {
        e.preventDefault();
        return;
    }
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.dataset.pieceId);
}

// Call this in generateSelectionBoard after creating each piece
piece.addEventListener('dragstart', handleDragStart);
```

**Acceptance Criteria**:
- Dragging only works on unplaced pieces
- Piece ID is stored in dataTransfer
- Visual feedback with 'dragging' class
- Prevents dragging placed pieces

---

## Task 11: Implement Drag End Handler
**File**: `js/script.js`

Add event listener for when dragging ends.

```javascript
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// Call this in generateSelectionBoard after creating each piece
piece.addEventListener('dragend', handleDragEnd);
```

**Acceptance Criteria**:
- Removes dragging class when drag ends
- Works regardless of drop success/failure

---

## Task 12: Implement Drag Over Handler for Drop Zones
**File**: `js/script.js`

Add event listener to allow dropping on zones.

```javascript
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!e.target.classList.contains('filled')) {
        e.target.classList.add('drag-over');
    }
}

// Call this in generateMainBoard after creating each dropZone
dropZone.addEventListener('dragover', handleDragOver);
```

**Acceptance Criteria**:
- Prevents default to allow drop
- Adds visual feedback (drag-over class)
- Only highlights empty zones

---

## Task 13: Implement Drag Leave Handler for Drop Zones
**File**: `js/script.js`

Remove highlight when dragging leaves a zone.

```javascript
function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

// Call this in generateMainBoard after creating each dropZone
dropZone.addEventListener('dragleave', handleDragLeave);
```

**Acceptance Criteria**:
- Removes drag-over class
- Visual feedback removed smoothly

---

## Task 14: Implement Drop Handler
**File**: `js/script.js`

Handle dropping a piece onto a zone.

```javascript
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropZone = e.target;
    dropZone.classList.remove('drag-over');
    
    // Don't allow dropping on filled zones
    if (dropZone.classList.contains('filled')) {
        return;
    }
    
    const pieceId = e.dataTransfer.getData('text/html');
    const piece = document.querySelector(`[data-piece-id="${pieceId}"]`);
    
    if (piece && !piece.classList.contains('placed')) {
        // Clone the piece and place it in the drop zone
        const placedPiece = piece.cloneNode(true);
        placedPiece.draggable = false;
        placedPiece.classList.add('in-board');
        dropZone.appendChild(placedPiece);
        
        // Mark original as placed
        piece.classList.add('placed');
        dropZone.classList.add('filled');
        
        // Check if puzzle is complete
        checkPuzzleComplete();
    }
}

// Call this in generateMainBoard after creating each dropZone
dropZone.addEventListener('drop', handleDrop);
```

**Acceptance Criteria**:
- Piece is cloned and placed in drop zone
- Original piece is marked as placed
- Zone is marked as filled
- Checks for puzzle completion

---

## Task 15: Add Styling for Placed Pieces
**File**: `style/style.css`

Style pieces that are on the board.

```css
.puzzle-piece.in-board {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 6px;
    animation: none;
    box-shadow: 0 2px 8px rgba(150, 200, 255, 0.4);
}

.puzzle-piece.dragging {
    opacity: 0.5;
    transform: scale(1.1);
}
```

**Acceptance Criteria**:
- Placed pieces fill drop zone
- No floating animation on board
- Dragging pieces are semi-transparent
- Visual distinction between board and selection pieces

---

## Task 16: Implement Puzzle Completion Check
**File**: `js/script.js`

Check if all pieces are correctly placed.

```javascript
function checkPuzzleComplete() {
    const dropZones = document.querySelectorAll('.puzzle-drop-zone');
    let correctCount = 0;
    
    dropZones.forEach((zone, index) => {
        const piece = zone.querySelector('.puzzle-piece');
        if (piece && piece.dataset.correctPosition == index) {
            correctCount++;
        }
    });
    
    if (correctCount === 16) {
        onPuzzleComplete();
    }
}
```

**Acceptance Criteria**:
- Counts correctly placed pieces
- Checks against correct positions
- Triggers completion when all 16 are correct

---

## Task 17: Create Puzzle Completion Handler
**File**: `js/script.js`

Handle what happens when puzzle is completed.

```javascript
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
```

**Acceptance Criteria**:
- Plays success sound
- Adds visual completion effect to board
- Shows message after delay

---

## Task 18: Add Puzzle Complete Animation
**File**: `style/animations.css`

Create animation for completed puzzle.

```css
@keyframes puzzleComplete {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(1.05);
        filter: brightness(1.3);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}

.puzzle-main-board.puzzle-complete {
    animation: puzzleComplete 2s ease-in-out;
    box-shadow: 0 0 40px rgba(200, 230, 255, 0.8);
}
```

**Acceptance Criteria**:
- Puzzle glows and scales when complete
- Heavenly glow effect
- Animation plays once

---

## Task 19: Create Completion Message Function
**File**: `js/script.js`

Display message when puzzle is solved.

```javascript
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
```

**Acceptance Criteria**:
- Message appears centered on screen
- Fades in smoothly
- Contains thematic text

---

## Task 20: Style Completion Message
**File**: `style/style.css`

Add styles for the completion message overlay.

```css
.puzzle-completion-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(240, 250, 255, 0.95);
    padding: 40px 60px;
    border-radius: 20px;
    box-shadow: 
        0 10px 50px rgba(180, 220, 255, 0.6),
        inset 0 1px 10px rgba(255, 255, 255, 0.8);
    opacity: 0;
    transition: opacity 1.5s ease-in-out;
    text-align: center;
    z-index: 1000;
}

.puzzle-completion-message.visible {
    opacity: 1;
}

.puzzle-completion-message h2 {
    color: rgba(80, 120, 180, 0.9);
    font-size: 36px;
    margin-bottom: 15px;
    text-shadow: 0 2px 10px rgba(150, 200, 255, 0.5);
}

.puzzle-completion-message p {
    color: rgba(100, 140, 200, 0.8);
    font-size: 18px;
    font-style: italic;
}
```

**Acceptance Criteria**:
- Centered overlay with heavenly aesthetic
- Smooth fade-in transition
- Thematic colors matching puzzle
- Readable, elegant typography

---

## Testing Checklist

After implementing all tasks, verify:

- [ ] Puzzle appears only when "restore" is chosen
- [ ] 5-second delay before puzzle shows
- [ ] Text moves up smoothly
- [ ] All 16 pieces are draggable
- [ ] Pieces can be dropped on any empty zone
- [ ] Pieces cannot be dragged twice
- [ ] Visual feedback during drag operations
- [ ] Floating animation works on selection pieces
- [ ] Placed pieces have no animation
- [ ] Completion check works correctly
- [ ] Success sound plays when complete
- [ ] Completion message displays
- [ ] Overall aesthetic is heavenly and hopeful

---

## Image Preparation Notes

When ready to add real images:

1. Create 16 puzzle piece images named: `puzzle-piece-0.png` through `puzzle-piece-15.png`
2. Place in `/public/assets/` folder
3. Each image should be at least 160×160px for quality
4. Images will automatically load via `background-image` property
5. Remove or hide the placeholder numbers by removing `piece.textContent = pieceIndex + 1;` line

---

**Implementation Order**: Follow tasks 1-20 sequentially for best results. Each task is independent enough to test individually.
