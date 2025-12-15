// HAIRGATOR Homepage - Menu Slideshow Demo

// Slideshow configuration
// Click positions for each slide (percentage based)
const slideConfig = [
    { // Slide 0 → 1: Click "Female" button
        clickX: 55,  // percentage from left
        clickY: 50,  // percentage from top
        duration: 2500
    },
    { // Slide 1 → 2: Click "Eye Brow" tab
        clickX: 38,
        clickY: 12,
        duration: 2500
    },
    { // Slide 2 → 3: Click rightmost card in first row
        clickX: 88,
        clickY: 38,
        duration: 2500
    },
    { // Slide 3 → 4: Click "룩북" button
        clickX: 40,
        clickY: 82,
        duration: 2500
    },
    { // Slide 4 → 5: Auto transition (lookbook scroll)
        clickX: 50,
        clickY: 50,
        duration: 2000,
        autoTransition: true
    },
    { // Slide 5 → 6: Auto transition (lookbook scroll)
        clickX: 50,
        clickY: 50,
        duration: 2000,
        autoTransition: true
    },
    { // Slide 6 → 0: Reset to beginning
        clickX: 50,
        clickY: 50,
        duration: 3000,
        autoTransition: true
    }
];

// Step mapping: which step indicator to highlight for each slide
const stepMapping = [0, 1, 2, 3, 4, 4, 4];

let currentSlide = 0;
let slideshowInterval = null;

// DOM Elements
const slides = document.querySelectorAll('.slideshow-image');
const clickIndicator = document.getElementById('clickIndicator');
const steps = document.querySelectorAll('.slideshow-steps .step');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStep(slideIndex) {
    const stepIndex = stepMapping[slideIndex];
    steps.forEach((step, i) => {
        step.classList.toggle('active', i === stepIndex);
    });
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    updateStep(index);
}

function positionClickIndicator(x, y) {
    const wrapper = document.querySelector('.slideshow-wrapper');
    if (!wrapper || !clickIndicator) return;

    const rect = wrapper.getBoundingClientRect();
    clickIndicator.style.left = `${x}%`;
    clickIndicator.style.top = `${y}%`;
    clickIndicator.style.transform = 'translate(-50%, -50%)';
}

async function performClick() {
    if (!clickIndicator) return;

    clickIndicator.classList.add('clicking');
    await sleep(600);
    clickIndicator.classList.remove('clicking');
}

async function runSlideshow() {
    while (true) {
        const config = slideConfig[currentSlide];

        // Position and show click indicator (unless auto transition)
        if (!config.autoTransition) {
            positionClickIndicator(config.clickX, config.clickY);
            clickIndicator.classList.add('show');

            // Wait a bit, then perform click
            await sleep(config.duration - 800);
            await performClick();
            await sleep(200);

            clickIndicator.classList.remove('show');
        } else {
            // Auto transition - just wait
            await sleep(config.duration);
        }

        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);

        // Small pause between slides
        await sleep(300);
    }
}

// Header scroll effect
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

// Smooth scroll
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

    // Start slideshow after a short delay
    if (slides.length > 0) {
        setTimeout(() => {
            runSlideshow();
        }, 1500);
    }
});
