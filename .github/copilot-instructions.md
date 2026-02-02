# Copilot Instructions - Interactive Narrative Game

## Project Overview

This is a browser-based interactive narrative experience built with vanilla JavaScript, HTML, and CSS. The project follows a scene-based progression model where users navigate through a dark, atmospheric story by making choices and collecting items.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Audio**: Web Audio API via `<audio>` elements
- **Storage**: `sessionStorage` for inventory persistence
- **Module System**: ES6 modules (`type="module"`)

## Architecture Patterns

### Scene-Based State Management

The application uses a **scene transition pattern** where different DOM containers represent distinct story states:

```javascript
// Core scene containers (from HTML)
- wordsContainer → Initial word selection scene
- textContainer → Individual word narrative scenes
- doorScreen → Door interaction scene
- manOnChair → Typewriter dialogue scene
- choiceContainer → Final choice outcome scene
```

**Rules**:
- Each scene container should have a corresponding `id` attribute
- Scene transitions must use fade-in/fade-out classes with timeouts
- Always hide the previous scene before showing the next (use `style.display = 'none'`)
- Never manipulate multiple scenes simultaneously without proper timing

### Audio Management Pattern

Audio is managed through three lifecycle phases:

1. **Creation**: `new Audio(filepath)` at the start of scene transitions
2. **Playback**: `.play()` with optional `.loop = true`
3. **Cleanup**: Use `destroyAudio()` helper to prevent memory leaks

**Rules**:
```javascript
// ✅ CORRECT: Clean up before transitioning
destroyAudio(intro);
heartbeat = new Audio('./public/sounds/heart-beat.ogg');
heartbeat.play();

// ❌ WRONG: Don't create without cleanup
intro = new Audio('./public/sounds/echoes.ogg'); // Memory leak if intro already exists
```

- Always store audio references in module-level variables (`intro`, `heartbeat`, `rust`)
- Call `destroyAudio()` before reassigning audio variables
- Use `buttonClickSound` as a local variable for transient sound effects

### Inventory System Pattern

The inventory uses a **singleton object pattern** with `sessionStorage` persistence:

```javascript
const inventory = {
    items: [],        // In-memory cache
    init() { },       // Load from sessionStorage
    add(item) { },    // Add with deduplication
    has(item) { },    // Check existence
    save() { }        // Persist to sessionStorage
};
```

**Rules**:
- Always call `inventory.init()` on page load
- Use `inventory.add()` for collecting items (returns boolean for success)
- Use `inventory.has()` for gating story branches
- Item names must be consistent strings (e.g., `'Basement Key'`)
- Never manipulate `inventory.items` directly; use the provided methods

### DOM Manipulation Patterns

#### 1. **Fade Transition Pattern**
```javascript
// Standard fade-out → action → fade-in sequence
container.classList.add('fade-out');
setTimeout(() => {
    container.style.display = 'none';
    nextContainer.style.display = 'flex';
    nextContainer.classList.add('visible');
}, 1000);
```

**Rules**:
- Always use `1000ms` (1 second) for primary scene transitions
- Use `500ms` for button fades
- Remove `fade-out` class when reversing transitions
- Set `display: flex` or `display: block` before adding `visible` class

#### 2. **Event Delegation Pattern**
```javascript
// Dynamic content requires inline handlers or post-render attachment
textContent.innerHTML = wordTexts[wordKey];
const keyElement = document.getElementById('basementKey');
if (keyElement) {
    keyElement.addEventListener('click', collectKey);
}
```

**Rules**:
- For dynamically injected HTML, attach event listeners **after** setting `innerHTML`
- Check element existence with `if (element)` before adding listeners
- Use `dataset` attributes for static content: `e.target.dataset.word`
- Expose functions to `window` scope **only** for inline `onclick` handlers

### Typewriter Effect Pattern

The typewriter uses a **recursive setTimeout pattern**:

```javascript
function typeWriter() {
    if (messageIndex >= messages.length) { /* done */ }
    if (charIndex < current.length) {
        container.textContent += current.charAt(charIndex);
        charIndex++;
        typingTimer = setTimeout(typeWriter, typingSpeed);
    } else {
        // Move to next message
    }
}
```

**Rules**:
- Store `typingTimer` reference for cleanup (`clearTimeout`)
- Reset `messageIndex` and `charIndex` before starting new typing sequence
- Clear `textContent` before starting: `container.textContent = ''`
- Use `700ms` delay between messages, `60ms` for individual characters
- Add `finished` class when complete to enable next UI elements

## File Organization

```
project-root/
├── index.html              # Single-page HTML structure
├── js/
│   └── script.js          # All application logic (monolithic)
├── style/
│   └── style.css          # All styles
└── public/
    ├── sounds/            # .ogg audio files
    └── assets/            # .png/.jpg images
```

**Rules**:
- Keep all JavaScript in `script.js` (no splitting yet)
- Use relative paths: `./public/sounds/`, `./style/style.css`
- Audio files must be `.ogg` format
- Images referenced via `<img src="./public/assets/...">`

## Naming Conventions

### Variables
- **Scene containers**: Suffix with `Container` or `Screen` (e.g., `textContainer`, `doorScreen`)
- **Audio variables**: Lowercase noun (e.g., `intro`, `heartbeat`, `rust`)
- **Transient sounds**: `const buttonClickSound`
- **State tracking**: Descriptive nouns (e.g., `messageIndex`, `typingTimer`)

### Functions
- **Scene transitions**: Verb + noun (e.g., `showWordText`, `showChoice`)
- **Action handlers**: Verb (e.g., `collectKey`, `openDoor`)
- **Checks**: `try` prefix (e.g., `tryGoToDoor`)
- **Utilities**: Verb + noun (e.g., `destroyAudio`, `enableManChoices`)

### IDs (HTML)
- Use camelCase for all element IDs
- Buttons: Descriptive + `Button` (e.g., `startButton`, `backButton`)
- Containers: Descriptive + `Container` or standalone (e.g., `wordsContainer`, `typewriter`)

## Code Consistency Rules

### 1. **Event Listener Registration**
```javascript
// ✅ CORRECT: Arrow function for simple handlers
document.getElementById('startButton').addEventListener('click', () => {
    // implementation
});

// ✅ CORRECT: Named function for reusable handlers
keyElement.addEventListener('click', collectKey);
```

### 2. **String Templating**
```javascript
// ✅ Use template literals for HTML injection
chooseDiv.innerHTML = `
    <span class="choice" id="sleep">Sleep</span>
`;

// ✅ Use object properties for dynamic text
textContent.innerHTML = wordTexts[wordKey];
```

### 3. **Conditional Branching**
```javascript
// ✅ CORRECT: Check inventory before allowing action
if (inventory.has('Basement Key')) {
    // Allow progression
} else {
    // Show error message
}
```

### 4. **Error Messaging Pattern**
```javascript
const message = document.createElement('div');
message.className = 'error-message'; // or 'item-obtained'
message.textContent = 'Message text';
document.body.appendChild(message);

setTimeout(() => {
    message.remove();
}, 2000);
```

**Rules**:
- Use 2-second display time for messages
- Classes: `error-message` for failures, `item-obtained` for successes
- Always append to `document.body`
- Always clean up with `setTimeout(() => message.remove())`

## Special Considerations

### Timing Dependencies
- Scene transitions depend on CSS animation timing (1000ms)
- Always match `setTimeout` delays to CSS transition durations
- For audio sync, add slight delays (e.g., 1000ms after unlock sound)

### State Reset Requirements
When returning to a previous scene:
```javascript
// Reset all relevant state
wordsContainer.style.display = '';
wordsContainer.classList.remove('fade-out');
wordsContainer.classList.add('visible');
```

### Memory Management
- Call `destroyAudio()` for long-running audio before scene changes
- Clear `typingTimer` with `clearTimeout()` before starting new typewriter sequence
- Use `sessionStorage` (not `localStorage`) for temporary inventory state

## Common Pitfalls to Avoid

1. **Double display assignment**: Don't set `display` twice in succession (line 301-302)
2. **Missing element checks**: Always verify element exists before adding listeners
3. **Audio leaks**: Never reassign audio variables without cleanup
4. **Race conditions**: Don't trigger scene transitions without waiting for fade completion
5. **Inconsistent timing**: Use standard delays (500ms, 700ms, 1000ms) throughout

---

**Last Updated**: Based on current `script.js` implementation with typewriter, inventory, and scene management patterns.
