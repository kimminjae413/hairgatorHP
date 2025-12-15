// HAIRGATOR Homepage - AI Studio Style Demo

const demoData = {
    theoryQuestion: 'A존, B존, C존에 대해 설명해줘',
    theoryImage: 'demo/텍스트레시피.jpg',
    uploadImage: 'demo/남자이미지.jpg',
    recipeImage: 'demo/남자레시피.jpg'
};

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const canvasContent = document.getElementById('canvasContent');

// Utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add message to chat
function addMessage(type, content, hasImage = false, imageSrc = '') {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;

    const avatar = document.createElement('div');
    avatar.className = `msg-avatar ${type === 'user' ? 'user-avatar' : ''}`;

    if (type === 'bot') {
        avatar.innerHTML = '<img src="logo.png" alt="H">';
    } else {
        avatar.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    }

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    if (hasImage && imageSrc) {
        bubble.innerHTML = `${content}<img src="${imageSrc}" alt="uploaded">`;
    } else {
        bubble.innerHTML = content;
    }

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    scrollToBottom();

    return msg;
}

// Add typing indicator
function addTypingIndicator() {
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    msg.id = 'typingMsg';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = '<img src="logo.png" alt="H">';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    scrollToBottom();

    return msg;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typing = document.getElementById('typingMsg');
    if (typing) typing.remove();
}

// Type text in input
async function typeInInput(text, speed = 60) {
    chatInput.value = '';
    sendBtn.classList.add('active');

    for (let i = 0; i < text.length; i++) {
        chatInput.value += text.charAt(i);
        await sleep(speed);
    }
}

// Show canvas result
function showCanvasResult(imageSrc) {
    canvasContent.innerHTML = `
        <div class="canvas-result">
            <img src="${imageSrc}" alt="AI Result">
        </div>
    `;
}

// Show scanning effect on canvas
function showScanningEffect(imageSrc) {
    canvasContent.innerHTML = `
        <div class="canvas-result scanning-effect">
            <img src="${imageSrc}" alt="Analyzing...">
        </div>
    `;
}

// Reset canvas
function resetCanvas() {
    canvasContent.innerHTML = `
        <div class="canvas-empty">
            <p>이미지를 업로드하면<br>AI가 분석한 결과가 여기에 표시됩니다</p>
        </div>
    `;
}

// Clear chat
function clearChat() {
    chatMessages.innerHTML = '';
    chatInput.value = '';
    sendBtn.classList.remove('active');
}

// Demo 1: Text Question
async function runTextDemo() {
    // Welcome message
    addMessage('bot', '<strong>안녕하세요! HAIRGATOR AI입니다.</strong><br>헤어스타일 사진을 업로드하거나 질문해주세요.');
    await sleep(1500);

    // Type question
    await typeInInput(demoData.theoryQuestion);
    await sleep(500);

    // Send message
    chatInput.value = '';
    sendBtn.classList.remove('active');
    addMessage('user', demoData.theoryQuestion);
    await sleep(500);

    // Bot typing
    addTypingIndicator();
    await sleep(2000);
    removeTypingIndicator();

    // Bot response
    addMessage('bot', '존(Zone)은 머리 전체를 구역별로 나누어 시술의 효율을 높이고, 각 구역의 특성에 맞는 디자인을 적용하기 위한 중요한 개념입니다.<br><br><strong>A존:</strong> 머리 뒤쪽 (후두부)<br><strong>B존:</strong> 귀 주변 및 측두부<br><strong>C존:</strong> 정수리 위쪽 영역');

    // Show theory image in canvas
    await sleep(500);
    showCanvasResult(demoData.theoryImage);

    await sleep(4000);
}

// Demo 2: Image Upload
async function runImageDemo() {
    // User uploads image
    addMessage('user', '이 헤어스타일에 맞는 레시피를 만들어주세요', true, demoData.uploadImage);
    await sleep(500);

    // Show scanning effect
    showScanningEffect(demoData.uploadImage);

    // Bot typing
    addTypingIndicator();
    await sleep(800);
    removeTypingIndicator();

    addMessage('bot', '이미지를 분석하고 있습니다... 🔍');

    await sleep(2500);

    // Bot response
    addMessage('bot', '✅ <strong>남자 스타일 분석 완료!</strong><br><br>스타일: 사이드 파트<br>탑 길이: Medium<br>사이드: Medium<br>텍스쳐: Smooth<br><br>👉 오른쪽 캔버스에서 맞춤 레시피를 확인하세요!');

    // Show recipe result
    await sleep(500);
    showCanvasResult(demoData.recipeImage);

    await sleep(5000);
}

// Main demo loop
async function startDemoLoop() {
    while (true) {
        // Reset
        clearChat();
        resetCanvas();
        await sleep(1000);

        // Demo 1: Text question
        await runTextDemo();

        // Reset for next demo
        clearChat();
        resetCanvas();
        await sleep(1000);

        // Demo 2: Image upload
        await runImageDemo();

        await sleep(2000);
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

    setTimeout(() => {
        startDemoLoop();
    }, 1000);
});
