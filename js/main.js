// HAIRGATOR Homepage - Interactive Image → Recipe Demo

// Demo data
const demo = {
    uploadImage: 'demo/남자이미지.jpg',
    recipeImage: 'demo/남자레시피.jpg'
};

let isAnimating = false;

// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const uploadArea = document.getElementById('uploadArea');
const uploadedImage = document.getElementById('uploadedImage');
const recipeScreenshot = document.getElementById('recipeScreenshot');

// Show step
function showStep(stepNum) {
    step1.classList.add('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');

    if (stepNum === 1) step1.classList.remove('hidden');
    if (stepNum === 2) step2.classList.remove('hidden');
    if (stepNum === 3) step3.classList.remove('hidden');
}

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run demo animation
async function runDemo() {
    if (isAnimating) return;
    isAnimating = true;

    // Step 1: Show upload area
    showStep(1);
    await sleep(1500);

    // Simulate drag effect
    uploadArea.classList.add('dragging');
    await sleep(800);
    uploadArea.classList.remove('dragging');

    // Step 2: Show uploaded image + analyzing
    uploadedImage.src = demo.uploadImage;
    showStep(2);
    await sleep(2500);

    // Step 3: Show recipe result
    recipeScreenshot.src = demo.recipeImage;
    showStep(3);

    isAnimating = false;
}

// Demo loop
async function startDemoLoop() {
    while (true) {
        await runDemo();
        // Wait before next demo
        await sleep(5000);
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
