let timeLeft;
let timerId = null;
let isWorkMode = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const workButton = document.getElementById('work');
const breakButton = document.getElementById('break');

// Border Tomato Animation
const tomatoes = [
    { position: 0, speed: 1 },    // Normal speed
    { position: 250, speed: 1.5 }, // 50% faster, starts 1/4 way around
    { position: 500, speed: 0.7 }, // 30% slower, starts halfway around
    { position: 750, speed: 2 }    // Double speed, starts 3/4 way around
];
const BORDER_STEPS = 1000;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function updateBorderTomato() {
    const width = window.innerWidth - 60;
    const height = window.innerHeight - 60;
    const perimeter = 2 * (width + height);
    
    tomatoes.forEach((tomato, index) => {
        const element = document.querySelector(`#tomato${index + 1}`);
        
        // Update position based on speed
        tomato.position = (tomato.position + tomato.speed) % BORDER_STEPS;
        const progress = tomato.position / BORDER_STEPS;
        
        let x, y, rotation;
        if (progress < width / perimeter) { // Top edge
            x = progress * perimeter * (width / perimeter);
            y = 0;
            rotation = 0;
        } else if (progress < (width + height) / perimeter) { // Right edge
            x = width;
            y = (progress - width / perimeter) * perimeter * (height / perimeter);
            rotation = 90;
        } else if (progress < (2 * width + height) / perimeter) { // Bottom edge
            x = width - (progress - (width + height) / perimeter) * perimeter * (width / perimeter);
            y = height;
            rotation = 180;
        } else { // Left edge
            x = 0;
            y = height - (progress - (2 * width + height) / perimeter) * perimeter * (height / perimeter);
            rotation = 270;
        }
        
        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    });
}

let borderTomatoInterval = null;

function startTimer() {
    if (timerId === null) {
        // Start the timer
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                alert(isWorkMode ? 'Sprint completed!' : 'Rest session completed!');
                // Stop border tomatoes when timer ends
                if (borderTomatoInterval) {
                    clearInterval(borderTomatoInterval);
                    borderTomatoInterval = null;
                    document.querySelectorAll('.border-tomato').forEach(tomato => {
                        tomato.classList.remove('active');
                    });
                }
            }
        }, 1000);
        
        // Start the border tomatoes
        document.querySelectorAll('.border-tomato').forEach(tomato => {
            tomato.classList.add('active');
        });
        if (!borderTomatoInterval) {
            borderTomatoInterval = setInterval(updateBorderTomato, 50);
        }
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    // Pause border tomatoes
    if (borderTomatoInterval) {
        clearInterval(borderTomatoInterval);
        borderTomatoInterval = null;
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
    updateDisplay();
    // Reset and stop border tomatoes
    if (borderTomatoInterval) {
        clearInterval(borderTomatoInterval);
        borderTomatoInterval = null;
        document.querySelectorAll('.border-tomato').forEach(tomato => {
            tomato.classList.remove('active');
        });
    }
    tomatoes.forEach((tomato, index) => {
        tomato.position = index * 250; // Reset to initial positions
    });
}

function setWorkMode() {
    isWorkMode = true;
    resetTimer();
}

function setBreakMode() {
    isWorkMode = false;
    resetTimer();
}

// Rick Astley Animation
function createRickAstley() {
    const container = document.querySelector('.rick-container');
    const rick = document.createElement('img');
    rick.src = 'https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif';
    rick.classList.add('rick');
    
    // Random size between 100px and 1000px
    const size = Math.random() * 900 + 100;
    rick.style.width = `${size}px`;
    
    // Random position
    rick.style.top = `${Math.random() * (window.innerHeight - size)}px`;
    rick.style.left = `${Math.random() * (window.innerWidth - size)}px`;
    
    // Add animation
    rick.style.animation = 'rickAppear 4s ease-in-out forwards';
    
    container.appendChild(rick);
    
    // Remove the element after animation
    setTimeout(() => {
        container.removeChild(rick);
    }, 4000);
}

// Create new Rick every 5 seconds
setInterval(createRickAstley, 5000);

// Initialize
timeLeft = 25 * 60;
updateDisplay();

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workButton.addEventListener('click', setWorkMode);
breakButton.addEventListener('click', setBreakMode); 