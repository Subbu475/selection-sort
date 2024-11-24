// Get references to key elements
const container = document.getElementById("array-container");
const generateButton = document.getElementById("generate");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resumeButton = document.getElementById("resume");
const explanation = document.getElementById("explanation");
const currentStep = document.getElementById("current-step").querySelector("p");

let array = [];
let isPaused = false;
const delay = 300; // Animation speed in ms

// Generate random array
function generateArray() {
    array = Array.from({ length: 20 }, () => Math.floor(Math.random() * 200) + 10);
    renderArray();
    explanation.innerText = "Click 'Start Selection Sort' to begin sorting!";
    currentStep.innerText = "Array generated! The algorithm is ready to sort.";
}

// Render array visually
function renderArray() {
    container.innerHTML = "";
    array.forEach((value) => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${value}px`;
        bar.innerText = value;
        container.appendChild(bar);
    });
}

// Add a delay for animations
function delayAnimation(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Pause execution until resumed
function pauseExecution() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (!isPaused) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

// Selection Sort Algorithm with Step-by-Step Explanation
async function selectionSort() {
    const bars = document.querySelectorAll(".bar");
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        currentStep.innerText = `Pass #${i + 1}: Searching for the smallest value from index ${i} onward.`;
        explanation.innerText = `The algorithm looks at the unsorted part of the array to find the smallest value and move it to position ${i}.`;

        for (let j = i + 1; j < array.length; j++) {
            if (isPaused) await pauseExecution();
            bars[j].classList.add("active");
            explanation.innerText = `Comparing values: ${array[j]} (index ${j}) and ${array[minIndex]} (current smallest at index ${minIndex}).`;
            await delayAnimation(delay);

            if (array[j] < array[minIndex]) {
                explanation.innerText = `New smallest value found: ${array[j]} at index ${j}.`;
                minIndex = j;
            }

            bars[j].classList.remove("active");
        }

        // Swap the smallest element with the first unsorted element
        if (minIndex !== i) {
            explanation.innerText = `Swapping values: ${array[i]} (index ${i}) and ${array[minIndex]} (index ${minIndex}).`;
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[minIndex].style.height = `${array[minIndex]}px`;
            bars[i].innerText = array[i];
            bars[minIndex].innerText = array[minIndex];
            bars[minIndex].classList.add("swapped");
            await delayAnimation(delay);
            bars[minIndex].classList.remove("swapped");
        }

        // Mark the current element as sorted
        bars[i].classList.add("sorted");
        currentStep.innerText = `Pass #${i + 1} complete: ${array[i]} is now sorted.`;
        await delayAnimation(delay);
    }

    explanation.innerText = "Sorting complete! The array is fully sorted.";
    currentStep.innerText = "The algorithm has finished sorting the array.";
}

// Event Listeners
generateButton.addEventListener("click", generateArray);
startButton.addEventListener("click", () => {
    isPaused = false;
    selectionSort();
});
pauseButton.addEventListener("click", () => {
    isPaused = true;
    explanation.innerText = "Sorting paused. Click 'Resume' to continue.";
});
resumeButton.addEventListener("click", () => {
    isPaused = false;
    explanation.innerText = "Sorting resumed!";
});

// Initialize on page load
generateArray();
