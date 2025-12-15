// HAIRGATOR Homepage - Interactive Image → Recipe Demo

const demos = [
    {
        styleImage: '메뉴판/app-female.jpg',
        diagramImage: '레시피/레시피2.png',
        badge: '여성 커트',
        name: '허쉬컷',
        details: [
            { label: '베이스', value: '원랭스 보브' },
            { label: '길이', value: '쇄골 라인' },
            { label: '레이어', value: 'C존 45도' },
            { label: '텍스쳐', value: '슬라이싱' },
            { label: '페이스라인', value: '턱선 프레이밍' },
            { label: '볼륨', value: '뿌리 볼륨펌' }
        ]
    },
    {
        styleImage: '메뉴판/app-male.png',
        diagramImage: '레시피/레시피4.png',
        badge: '남성 커트',
        name: '투블럭 댄디컷',
        details: [
            { label: '사이드', value: '3mm 페이드' },
            { label: '연결부', value: '6mm 그라데이션' },
            { label: '탑 길이', value: '5-7cm' },
            { label: '텍스쳐', value: '포인트컷' },
            { label: '스타일링', value: '내추럴 업' },
            { label: '볼륨', value: '탑 볼륨' }
        ]
    },
    {
        styleImage: '레시피/레시피3.jpg',
        diagramImage: '레시피/레시피2.png',
        badge: '여성 펌',
        name: 'S컬 웨이브펌',
        details: [
            { label: '로드', value: '17mm' },
            { label: '와인딩', value: '스파이럴' },
            { label: '각도', value: '천체축 45도' },
            { label: '처리시간', value: '15-20분' },
            { label: '타겟존', value: 'B존~C존' },
            { label: '텐션', value: '중간 텐션' }
        ]
    }
];

let currentDemoIndex = 0;
let isAnimating = false;

// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const uploadArea = document.getElementById('uploadArea');
const uploadedImage = document.getElementById('uploadedImage');
const resultOriginal = document.getElementById('resultOriginal');
const resultDiagram = document.getElementById('resultDiagram');
const recipeBadge = document.getElementById('recipeBadge');
const recipeName = document.getElementById('recipeName');
const recipeDetails = document.getElementById('recipeDetails');

// Show step
function showStep(stepNum) {
    step1.classList.add('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');

    if (stepNum === 1) step1.classList.remove('hidden');
    if (stepNum === 2) step2.classList.remove('hidden');
    if (stepNum === 3) step3.classList.remove('hidden');
}

// Build recipe details HTML
function buildRecipeDetails(details) {
    return details.map(item => `
        <div class="recipe-detail-item">
            <span class="recipe-detail-label">${item.label}</span>
            <span class="recipe-detail-value">${item.value}</span>
        </div>
    `).join('');
}

// Run demo animation
async function runDemo(demo) {
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
    uploadedImage.src = demo.styleImage;
    showStep(2);
    await sleep(2500);

    // Step 3: Show result
    resultOriginal.src = demo.styleImage;
    resultDiagram.src = demo.diagramImage;
    recipeBadge.textContent = demo.badge;
    recipeName.textContent = demo.name;
    recipeDetails.innerHTML = buildRecipeDetails(demo.details);
    showStep(3);

    isAnimating = false;
}

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Demo loop
async function startDemoLoop() {
    while (true) {
        await runDemo(demos[currentDemoIndex]);

        // Wait before next demo
        await sleep(5000);

        // Next demo
        currentDemoIndex = (currentDemoIndex + 1) % demos.length;
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
