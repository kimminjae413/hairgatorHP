// HAIRGATOR Homepage - Interactive Demo

const demos = [
    {
        question: "허쉬컷 레시피 알려줘",
        icon: "✂️",
        title: "허쉬컷 레시피",
        recipe: [
            "베이스: 원랭스 보브 (쇄골 라인)",
            "레이어: C존 45도 그라데이션",
            "페이스라인: 턱선 프레이밍",
            "텍스쳐: 슬라이싱 + 포인트컷"
        ]
    },
    {
        question: "뿌리펌 와인딩 각도는?",
        icon: "🌀",
        title: "뿌리펌 가이드",
        recipe: [
            "로드 크기: 17mm (뿌리 볼륨용)",
            "와인딩 각도: 천체축 90도",
            "텐션: 중간 텐션 유지",
            "처리시간: 15-20분 (모질에 따라)"
        ]
    },
    {
        question: "C존이 뭐야?",
        icon: "📐",
        title: "C존 (Crown Zone)",
        recipe: [
            "위치: 정수리 위쪽 영역",
            "역할: 볼륨 형성, 윤곽 조절",
            "특징: 소프트한 질감 담당",
            "기법: Internal 레이어 적용"
        ]
    },
    {
        question: "남자 투블럭 레시피",
        icon: "💈",
        title: "남자 투블럭 레시피",
        recipe: [
            "사이드: 3mm 페이드 시작",
            "연결부: 6mm 그라데이션",
            "탑: 5-7cm 텍스쳐 레이어",
            "마무리: 슬라이싱으로 가벼움"
        ]
    }
];

let currentDemoIndex = 0;
let isAnimating = false;

// DOM Elements
const typingText = document.getElementById('typingText');
const userMessage = document.getElementById('userMessage');
const aiMessage = document.getElementById('aiMessage');
const loadingDots = document.getElementById('loadingDots');
const recipeCard = document.getElementById('recipeCard');
const recipeTitle = document.getElementById('recipeTitle');
const recipeBody = document.getElementById('recipeBody');

// Typing animation
function typeText(text, element, speed = 50) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';

        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                resolve();
            }
        }, speed);
    });
}

// Show recipe with animation
function showRecipe(demo) {
    // Update recipe content
    recipeTitle.textContent = demo.title;
    document.querySelector('.recipe-icon').textContent = demo.icon;

    // Build recipe items
    recipeBody.innerHTML = demo.recipe
        .map(item => `<div class="recipe-item">${item}</div>`)
        .join('');

    // Hide loading, show recipe
    loadingDots.classList.add('hidden');
    recipeCard.classList.remove('hidden');

    // Trigger animation
    setTimeout(() => {
        recipeCard.classList.add('show');
    }, 50);
}

// Reset demo state
function resetDemo() {
    typingText.textContent = '';
    aiMessage.classList.add('hidden');
    loadingDots.classList.remove('hidden');
    recipeCard.classList.add('hidden');
    recipeCard.classList.remove('show');
}

// Run single demo animation
async function runDemo(demo) {
    if (isAnimating) return;
    isAnimating = true;

    // Reset state
    resetDemo();

    // Type the question
    await typeText(demo.question, typingText, 60);

    // Wait a bit
    await new Promise(r => setTimeout(r, 600));

    // Show AI message with loading
    aiMessage.classList.remove('hidden');

    // Wait for "thinking"
    await new Promise(r => setTimeout(r, 1500));

    // Show recipe
    showRecipe(demo);

    isAnimating = false;
}

// Demo loop
async function startDemoLoop() {
    while (true) {
        await runDemo(demos[currentDemoIndex]);

        // Wait before next demo
        await new Promise(r => setTimeout(r, 4000));

        // Next demo
        currentDemoIndex = (currentDemoIndex + 1) % demos.length;
    }
}

// Intersection Observer for demo
function setupDemoObserver() {
    const demoContainer = document.querySelector('.demo-container');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isAnimating) {
                // Start demo when visible
                runDemo(demos[currentDemoIndex]);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(demoContainer);
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
