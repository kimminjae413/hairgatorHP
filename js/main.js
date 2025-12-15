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

// ==================== AI Analysis Canvas Animation ====================

function initAIAnalysisCanvas() {
    const canvas = document.getElementById('ai-analysis-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 페이스 메쉬 포인트들 (얼굴 영역에 집중)
    const facePoints = [];
    const hairPoints = [];
    const numFacePoints = 30;
    const numHairPoints = 20;

    // 얼굴 영역 포인트 생성 (이미지 중앙 하단)
    for (let i = 0; i < numFacePoints; i++) {
        facePoints.push({
            x: 0.3 + Math.random() * 0.4, // 30-70% 가로
            y: 0.3 + Math.random() * 0.4, // 30-70% 세로
            size: Math.random() * 3 + 2,
            pulse: Math.random() * Math.PI * 2,
            connections: []
        });
    }

    // 헤어 영역 포인트 생성 (이미지 상단)
    for (let i = 0; i < numHairPoints; i++) {
        hairPoints.push({
            x: 0.2 + Math.random() * 0.6, // 20-80% 가로
            y: 0.1 + Math.random() * 0.25, // 10-35% 세로
            size: Math.random() * 2 + 1,
            pulse: Math.random() * Math.PI * 2
        });
    }

    // 연결선 설정
    facePoints.forEach((point, i) => {
        const nearbyPoints = facePoints
            .map((p, j) => ({ index: j, dist: Math.hypot(p.x - point.x, p.y - point.y) }))
            .filter(p => p.index !== i && p.dist < 0.15)
            .slice(0, 3);
        point.connections = nearbyPoints.map(p => p.index);
    });

    let animationFrame = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const w = canvas.width;
        const h = canvas.height;

        // 페이스 메쉬 그리기
        ctx.strokeStyle = 'rgba(233, 30, 99, 0.3)';
        ctx.lineWidth = 1;

        // 연결선 그리기
        facePoints.forEach((point, i) => {
            point.connections.forEach(j => {
                const other = facePoints[j];
                ctx.beginPath();
                ctx.moveTo(point.x * w, point.y * h);
                ctx.lineTo(other.x * w, other.y * h);
                ctx.stroke();
            });
        });

        // 페이스 포인트 그리기
        facePoints.forEach((point, i) => {
            const pulse = Math.sin(animationFrame * 0.05 + point.pulse) * 0.5 + 0.5;
            const size = point.size * (1 + pulse * 0.3);

            ctx.beginPath();
            ctx.arc(point.x * w, point.y * h, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(233, 30, 99, ${0.5 + pulse * 0.5})`;
            ctx.fill();

            // 글로우 효과
            ctx.beginPath();
            ctx.arc(point.x * w, point.y * h, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(233, 30, 99, ${0.1 * pulse})`;
            ctx.fill();
        });

        // 헤어 분석 포인트 그리기
        hairPoints.forEach((point, i) => {
            const pulse = Math.sin(animationFrame * 0.03 + point.pulse) * 0.5 + 0.5;

            // 수직선 (헤어 분석 느낌)
            ctx.beginPath();
            ctx.moveTo(point.x * w, point.y * h);
            ctx.lineTo(point.x * w, point.y * h + 20 + pulse * 10);
            ctx.strokeStyle = `rgba(236, 64, 122, ${0.3 + pulse * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // 포인트
            ctx.beginPath();
            ctx.arc(point.x * w, point.y * h, point.size * (1 + pulse * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(236, 64, 122, ${0.6 + pulse * 0.4})`;
            ctx.fill();
        });

        // 분석 그리드 효과
        ctx.strokeStyle = 'rgba(233, 30, 99, 0.05)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // 코너 타겟팅 UI
        const cornerSize = 40;
        ctx.strokeStyle = 'rgba(233, 30, 99, 0.6)';
        ctx.lineWidth = 2;

        // 좌상단
        ctx.beginPath();
        ctx.moveTo(20, 20 + cornerSize);
        ctx.lineTo(20, 20);
        ctx.lineTo(20 + cornerSize, 20);
        ctx.stroke();

        // 우상단
        ctx.beginPath();
        ctx.moveTo(w - 20 - cornerSize, 20);
        ctx.lineTo(w - 20, 20);
        ctx.lineTo(w - 20, 20 + cornerSize);
        ctx.stroke();

        // 좌하단
        ctx.beginPath();
        ctx.moveTo(20, h - 20 - cornerSize);
        ctx.lineTo(20, h - 20);
        ctx.lineTo(20 + cornerSize, h - 20);
        ctx.stroke();

        // 우하단
        ctx.beginPath();
        ctx.moveTo(w - 20 - cornerSize, h - 20);
        ctx.lineTo(w - 20, h - 20);
        ctx.lineTo(w - 20, h - 20 - cornerSize);
        ctx.stroke();

        animationFrame++;
        requestAnimationFrame(draw);
    }

    draw();
}

// ==================== Typing Animation ====================

const typingTexts = [
    { text: '감각에 데이터를 더해', type: 'normal' },
    { text: '\n', type: 'break' },
    { text: '디자이너의 기술을 ', type: 'normal' },
    { text: '확신', type: 'highlight' },
    { text: '으로 만드는', type: 'normal' },
    { text: '\n', type: 'break' },
    { text: 'AI 헤어 솔루션', type: 'bold' },
    { text: '입니다.', type: 'normal' }
];

let typingElement = null;
let cursorElement = null;
let currentSegment = 0;
let currentChar = 0;
let typingStarted = false;

function typeNextChar() {
    if (!typingElement) return;

    if (currentSegment >= typingTexts.length) {
        // 타이핑 완료 - 잠시 대기 후 리셋하고 반복
        setTimeout(() => {
            typingElement.innerHTML = '';
            currentSegment = 0;
            currentChar = 0;
            if (cursorElement) {
                cursorElement.style.display = 'inline-block';
            }
            setTimeout(typeNextChar, 500);
        }, 3000); // 3초 대기 후 반복
        return;
    }

    const segment = typingTexts[currentSegment];

    if (segment.type === 'break') {
        typingElement.innerHTML += '<br>';
        currentSegment++;
        currentChar = 0;
        setTimeout(typeNextChar, 100);
        return;
    }

    if (currentChar < segment.text.length) {
        const char = segment.text[currentChar];

        if (currentChar === 0 && segment.type !== 'normal') {
            // 새 스타일 세그먼트 시작
            if (segment.type === 'highlight') {
                typingElement.innerHTML += '<span class="highlight">';
            } else if (segment.type === 'bold') {
                typingElement.innerHTML += '<span class="bold">';
            }
        }

        typingElement.innerHTML = typingElement.innerHTML.replace(/<\/span>$/, '') + char;

        if (segment.type !== 'normal') {
            typingElement.innerHTML += '</span>';
        }

        currentChar++;

        // 타이핑 속도 (랜덤하게 자연스럽게)
        const speed = Math.random() * 50 + 50; // 50-100ms
        setTimeout(typeNextChar, speed);
    } else {
        currentSegment++;
        currentChar = 0;
        setTimeout(typeNextChar, 80);
    }
}

function startTypingAnimation() {
    typingElement = document.getElementById('typing-text');
    cursorElement = document.querySelector('.typing-cursor');

    if (!typingElement || typingStarted) return;

    typingStarted = true;

    // Intersection Observer로 화면에 보일 때 시작
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeNextChar, 500);
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(typingElement);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupHeaderScroll();
    setupSmoothScroll();

    // Start AI analysis canvas animation
    initAIAnalysisCanvas();

    // Start typing animation
    startTypingAnimation();

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
