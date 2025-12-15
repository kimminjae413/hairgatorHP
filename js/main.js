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

// ==================== AI Studio Chat Demo ====================

// AI Studio DOM Elements
const chatMessages = document.getElementById('chatMessages');
const canvasContent = document.getElementById('canvasContent');
const uploadBtn = document.getElementById('uploadBtn');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');

// Demo conversation script
const chatDemoScript = [
    {
        type: 'user',
        message: '이 스타일 분석해주세요',
        image: 'demo/남자이미지.jpg',
        delay: 1500
    },
    {
        type: 'bot',
        message: '분석 중입니다...',
        typing: true,
        delay: 800
    },
    {
        type: 'canvas',
        action: 'analyze',
        image: 'demo/남자이미지.jpg',
        delay: 2500
    },
    {
        type: 'bot',
        message: '남자 숏컷 스타일입니다. 사이드는 짧게 커트하고 윗머리에 볼륨을 준 클래식한 스타일이네요.',
        delay: 1200
    },
    {
        type: 'canvas',
        action: 'showResult',
        image: 'demo/남자레시피.jpg',
        delay: 2000
    },
    {
        type: 'user',
        message: '레이어 각도 설명해줘',
        delay: 2000
    },
    {
        type: 'bot',
        message: '레이어 각도에 대해 설명드릴게요.',
        typing: true,
        delay: 800
    },
    {
        type: 'canvas',
        action: 'showResult',
        image: 'demo/텍스트레시피.jpg',
        delay: 2500
    },
    {
        type: 'reset',
        delay: 4000
    }
];

let chatDemoIndex = 0;
let chatDemoRunning = false;

function createMessage(type, message, image = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${type}`;

    const avatar = document.createElement('div');
    avatar.className = `msg-avatar ${type === 'user' ? 'user-avatar' : ''}`;

    if (type === 'bot') {
        avatar.innerHTML = '<img src="logo.png" alt="AI">';
    } else {
        avatar.textContent = '👤';
    }

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    if (message) {
        bubble.textContent = message;
    }

    if (image) {
        const img = document.createElement('img');
        img.src = image;
        img.alt = '첨부 이미지';
        bubble.appendChild(img);
    }

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);

    return msgDiv;
}

function createTypingIndicator() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot';
    msgDiv.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = '<img src="logo.png" alt="AI">';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);

    return msgDiv;
}

function showAnalyzingEffect(imageSrc) {
    canvasContent.innerHTML = `
        <div class="canvas-result analyzing-effect">
            <img src="${imageSrc}" alt="분석 중">
            <div class="scan-grid"></div>
            <div class="pulse-point" style="top: 20%; left: 30%;"></div>
            <div class="pulse-point" style="top: 40%; left: 60%;"></div>
            <div class="pulse-point" style="top: 70%; left: 40%;"></div>
            <div class="analysis-progress"></div>
        </div>
    `;
}

function showResultImage(imageSrc) {
    canvasContent.innerHTML = `
        <div class="canvas-result">
            <img src="${imageSrc}" alt="분석 결과">
        </div>
    `;
}

function resetCanvas() {
    canvasContent.innerHTML = `
        <div class="canvas-empty">
            <p>이미지를 업로드하면<br>AI가 분석한 결과가 여기에 표시됩니다</p>
        </div>
    `;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

async function runChatDemo() {
    chatDemoRunning = true;

    while (chatDemoRunning) {
        // Reset for new loop
        if (chatMessages) chatMessages.innerHTML = '';
        resetCanvas();
        chatDemoIndex = 0;

        for (const step of chatDemoScript) {
            if (!chatDemoRunning) break;

            await sleep(step.delay);

            switch (step.type) {
                case 'user':
                    if (chatMessages) {
                        // Highlight upload button briefly
                        if (step.image && uploadBtn) {
                            uploadBtn.classList.add('active');
                            await sleep(300);
                            uploadBtn.classList.remove('active');
                        }

                        const userMsg = createMessage('user', step.message, step.image);
                        chatMessages.appendChild(userMsg);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                    break;

                case 'bot':
                    if (chatMessages) {
                        if (step.typing) {
                            const typingEl = createTypingIndicator();
                            chatMessages.appendChild(typingEl);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        } else {
                            removeTypingIndicator();
                            const botMsg = createMessage('bot', step.message);
                            chatMessages.appendChild(botMsg);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }
                    }
                    break;

                case 'canvas':
                    removeTypingIndicator();
                    if (step.action === 'analyze') {
                        showAnalyzingEffect(step.image);
                    } else if (step.action === 'showResult') {
                        showResultImage(step.image);
                    }
                    break;

                case 'reset':
                    // Wait then restart
                    break;
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupHeaderScroll();
    setupSmoothScroll();

    // Start menu slideshow after a short delay
    if (slides.length > 0) {
        setTimeout(() => {
            runSlideshow();
        }, 1500);
    }

    // Start AI chat demo after a delay
    if (chatMessages) {
        setTimeout(() => {
            runChatDemo();
        }, 2000);
    }
});
