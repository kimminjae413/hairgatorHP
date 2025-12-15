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
        message: 'A존이 뭐야?',
        delay: 2000
    },
    {
        type: 'bot',
        message: 'A존에 대해 설명드릴게요.',
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

function createMessage(type, message, image = null, useTypingEffect = false) {
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
        if (type === 'bot' && useTypingEffect) {
            // 타이핑 효과로 메시지 표시
            bubble.innerHTML = '<span class="typing-text-demo"></span><span class="typing-cursor-demo">|</span>';
            setTimeout(() => {
                typeMessageEffect(bubble.querySelector('.typing-text-demo'), message, bubble.querySelector('.typing-cursor-demo'));
            }, 100);
        } else {
            bubble.textContent = message;
        }
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

// 메시지 타이핑 효과
function typeMessageEffect(element, text, cursor) {
    let index = 0;
    const speed = 30; // 타이핑 속도 (ms)

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // 타이핑 완료 후 커서 숨기기
            if (cursor) {
                cursor.style.display = 'none';
            }
        }
    }
    type();
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
                            // 타이핑 효과 적용
                            const botMsg = createMessage('bot', step.message, null, true);
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

// ==================== Reviews Slider ====================

const reviews = [
    {
        name: '조ㅇㅇ',
        text: '크리스기원장님 교육 너무 감사했습니다. 2WAY CUT 교육을 받고나서 정말 도움이 많이 되었고 미용권태기 왔었는데 커트교육을 통해 다시 미용이 재밌어졌습니다. 7일째 되니까 제가 점점 궁금한 것 질문이 생기게 되었고 정말 잘 설명해 주셔서 그때부터 이해가 되고 실력이 확 늘었어요! 재방 손님들도 거의 90퍼였습니다. 실전 꿀팁도 많이 알려주시고 해서 저도 믿고 따라간 것 같아요.'
    },
    {
        name: '유ㅇㅇ',
        text: '원장님 2021년도 팟팅하세요!! 저는 원장님께 교육받고 나서 막히는 일 없이 술술 잘 해내가고 있어요!! 감사합니다. 다른 아카데미에서 교육 과정 이수 받고도 손님들께 머리 해드리기가 어려워서 원장님께 간 거였는데 가길 최고 잘 한 거 같아요. 크리스기 아카데미 2WAY CUT 파이팅! 최고의 2020년도였습니당!!!'
    },
    {
        name: '이ㅇㅇ',
        text: '2WAY CUT 교육을 받으면서 짧은 시간이였지만 하루하루 너무 많은 걸 배워가는 거 같아서 좋았습니다! 실제 살롱에서 쓰이는 것과 응용법 위주로 알려주시고 이론, 자세 등등 꼼꼼히 알려주셔서 많이 고치고 배웠던 거 같아요. 본격적으로 디자이너 되기 전에 커트학원을 알아보다가 여기를 선택했는데 진짜 제 인생에 터닝포인트가 된 거 같아 너무 만족합니다. 원장님 덕분에 실력 엄청 향상해 갑니다~'
    },
    {
        name: '김ㅇㅇ',
        text: '크리스기 아카데미 2WAY CUT 교육을 받고 좋았던 점은 기본기가 부족해서 항상 커트는 어려운 것이라고만 생각했는데 베이직과 함께 병행하면서 사진을 보고 도해도를 스스로 생각할 수 있게 되어서 너무 좋았습니다. 이전엔 기계적으로 외워서 커트를 배웠다면 원장님 교육을 듣고 난 후에는 스스로 생각해서 응용 커트까지 할 수 있게 되어서 너무 좋았습니다.'
    },
    {
        name: '윤ㅇㅇ',
        text: '인턴생활 2년하고 2way cut 아카데미를 알게 되어 크리스기 원장님께 교육 받았습니다. 가위질부터 베이직컷, 응용컷까지 원장님께서 세심하게 잘 가르쳐 주십니다. 컷트교육을 지금까지 제대로 받아본 적이 없었기에 백지상태인 저에게 크리스기 원장님 교육은 너무너무 훌륭했고 실전에서 쉽게 할 수 있는 것들을 콕콕 짚어서 알려주셔서 너무 좋았습니다!'
    },
    {
        name: '박ㅇㅇ',
        text: '초디 시기에 여기저기 커트 교육을 다녀도 항상 실력이 제자리라 미용에 소질이 없나 그만둬야 되나 많은 고민을 했던 찰나에 크리스기 아카데미를 알게 된 건 큰 행운이였어요. 2way cut은 형식적인 커트가 아닌 상황에 맞게 유연하게 풀어갈 수 있는 방향을 제시해 주는 커트였습니다. 너무 만족스럽고 제 인생에 큰 전환점이였어요.'
    },
    {
        name: '하ㅇㅇ',
        text: '인턴생활 2년 동안 하다가 지인의 소개로 크리스기 원장님에게 교육을 받았습니다. 처음에는 무섭고 너무 이른 게 아닌가 걱정했는데 원장님의 교육 방식과 흐름을 알고 나서부터 조금씩 걱정이 사라지고 자신감이 생겼습니다. 2WAY컷 흐름대로 배우다 보니 커트 디자인이 보이고 어떻게 하면 더 이쁘게 나온다 이런 게 머리에 새겨졌습니다.'
    },
    {
        name: '박ㅇㅇ',
        text: '6주 동안 정말 많은 것을 배운 시간이였습니다. 교육을 받기 전 다른 컷트 교육을 배웠을 때는 교육을 받은 후에도 그것을 실제로 대입하여 사용하는데 굉장히 많은 어려움을 겪었습니다. 하지만 이번 교육을 배우면서 정말 쉽게 사용할 수 있고 어려움 없이 사용할 수 있는 거에 대해서 많은 감동을 받았습니다. 6주 처음엔 길다고 생각했지만 짧은 시간이였고 정말 좋은 시간이였습니다.'
    },
    {
        name: '이ㅇㅇ',
        text: '교육 후기입니다! 스스로 생각할 수 있는 힘을 길러주는 교육이었습니다. 틀에 갇혀 정답만을 알려주는 일반 커리큘럼과는 다르게 같은 스타일이라도 다방면으로 접근할 수 있도록 힘을 길러주시고, 그 방법을 알려주셔서 좋았습니다. 한 달 반이라는 짧은 시간 동안 커트 방법부터 질감, 스타일링, 펌 등등 다양한 분야를 다양한 측면에서 교육해 주셔서 너무 재밌었습니다.'
    },
    {
        name: '손ㅇㅇ',
        text: '고등학교 때부터 같이 미용을 해오던 친구를 통해 아카데미에 대해서 알게 되었습니다. 크리스기 원장님을 처음 뵀을 땐 걱정도 잠시 원장님께서 기초부터 차근차근 가르쳐 주는 모습에 무조건 믿고 따라가야겠다고 다짐했습니다. 원장님께서는 메뉴얼에 따른 커트를 가르치는 것을 넘어서서 저희가 살롱에서도 능동적으로 스타일을 뽑아낼 수 있는 디자이너가 되게끔 도와주셨습니다.'
    }
];

let currentReviewIndex = 0;
let reviewAutoPlayInterval = null;

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

let shuffledReviews = shuffleArray(reviews);

function displayReview(index) {
    const reviewCard = document.getElementById('reviewCard');
    const reviewText = document.getElementById('reviewText');
    const reviewName = document.getElementById('reviewName');
    const reviewAvatar = document.getElementById('reviewAvatar');

    if (!reviewCard || !reviewText || !reviewName || !reviewAvatar) return;

    // Fade out
    reviewCard.classList.add('fade-out');
    reviewCard.classList.remove('fade-in');

    setTimeout(() => {
        const review = shuffledReviews[index];
        reviewText.textContent = review.text;
        reviewName.textContent = review.name;
        reviewAvatar.textContent = review.name.charAt(0);

        // Update dots
        updateReviewDots(index);

        // Fade in
        reviewCard.classList.remove('fade-out');
        reviewCard.classList.add('fade-in');
    }, 300);
}

function updateReviewDots(activeIndex) {
    const dots = document.querySelectorAll('.review-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
    });
}

function createReviewDots() {
    const dotsContainer = document.getElementById('reviewDots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    shuffledReviews.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'review-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            currentReviewIndex = index;
            displayReview(currentReviewIndex);
            resetReviewAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });
}

function nextReview() {
    currentReviewIndex = (currentReviewIndex + 1) % shuffledReviews.length;
    displayReview(currentReviewIndex);
}

function prevReview() {
    currentReviewIndex = (currentReviewIndex - 1 + shuffledReviews.length) % shuffledReviews.length;
    displayReview(currentReviewIndex);
}

function resetReviewAutoPlay() {
    if (reviewAutoPlayInterval) {
        clearInterval(reviewAutoPlayInterval);
    }
    reviewAutoPlayInterval = setInterval(nextReview, 6000);
}

function initReviewSlider() {
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevReview();
            resetReviewAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextReview();
            resetReviewAutoPlay();
        });
    }

    // Create dots
    createReviewDots();

    // Display first review
    displayReview(0);

    // Start auto-play
    reviewAutoPlayInterval = setInterval(nextReview, 6000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupHeaderScroll();
    setupSmoothScroll();

    // Start AI analysis canvas animation
    initAIAnalysisCanvas();

    // Start typing animation
    startTypingAnimation();

    // Initialize review slider
    initReviewSlider();

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
