// HAIRGATOR Homepage - Interactive Demo
// Demo 1: Text Question → Theory Explanation
// Demo 2: Image Upload → Recipe Result

const demoData = {
    // Demo 1: Text question
    question: 'A존, B존, C존에 대해 설명해줘',
    theoryImage: 'demo/텍스트레시피.jpg',

    // Demo 2: Image upload
    uploadImage: 'demo/남자이미지.jpg',
    recipeImage: 'demo/남자레시피.jpg'
};

let isAnimating = false;

// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');
const step5 = document.getElementById('step5');
const step6 = document.getElementById('step6');

const uploadArea = document.getElementById('uploadArea');
const uploadedImage = document.getElementById('uploadedImage');
const recipeScreenshot = document.getElementById('recipeScreenshot');
const typingText = document.getElementById('typingText');
const theoryScreenshot = document.getElementById('theoryScreenshot');

// Hide all steps
function hideAllSteps() {
    [step1, step2, step3, step4, step5, step6].forEach(step => {
        step.classList.add('hidden');
    });
}

// Show specific step
function showStep(stepNum) {
    hideAllSteps();
    const step = document.getElementById(`step${stepNum}`);
    if (step) step.classList.remove('hidden');
}

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Typing animation
async function typeText(text, element, speed = 80) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        await sleep(speed);
    }
}

// Demo 1: Text Question → Theory Explanation
async function runTextDemo() {
    // Step 4: Show typing input
    showStep(4);
    await typeText(demoData.question, typingText, 80);
    await sleep(500);

    // Step 5: Show sent message + AI responding
    showStep(5);
    await sleep(2000);

    // Step 6: Show theory result with zoom effects
    theoryScreenshot.src = demoData.theoryImage;
    theoryScreenshot.className = 'theory-screenshot';
    showStep(6);
    await sleep(1500);

    // Zoom to left (text explanation)
    theoryScreenshot.classList.add('zoom-left');
    await sleep(2000);

    // Zoom to right (diagram image)
    theoryScreenshot.classList.remove('zoom-left');
    theoryScreenshot.classList.add('zoom-right');
    await sleep(2000);

    // Back to normal
    theoryScreenshot.classList.remove('zoom-right');
    await sleep(1500);
}

// Demo 2: Image Upload → Recipe Result
async function runImageDemo() {
    // Step 1: Show upload area
    showStep(1);
    await sleep(1500);

    // Simulate drag effect
    uploadArea.classList.add('dragging');
    await sleep(800);
    uploadArea.classList.remove('dragging');

    // Step 2: Show uploaded image + analyzing
    uploadedImage.src = demoData.uploadImage;
    showStep(2);
    await sleep(2500);

    // Step 3: Show recipe result
    recipeScreenshot.src = demoData.recipeImage;
    showStep(3);
    await sleep(4000);
}

// Main demo loop
async function startDemoLoop() {
    while (true) {
        if (isAnimating) {
            await sleep(100);
            continue;
        }

        isAnimating = true;

        // Demo 1: Text question first
        await runTextDemo();
        await sleep(1000);

        // Demo 2: Image upload second
        await runImageDemo();
        await sleep(1000);

        isAnimating = false;
    }
}

// Header scroll effect
function setupHeaderScroll() {
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupHeaderScroll();
    setupSmoothScroll();

    // Start demo loop after a short delay
    setTimeout(() => {
        startDemoLoop();
    }, 1000);
});
