const commandInput = document.getElementById('commandInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const chatContainer = document.getElementById('chatContainer');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

let recognition = null;
let isListening = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    console.log('Recognition started');
    isListening = true;
    voiceBtn.classList.add('listening');
    statusDot.classList.add('listening');
    statusText.textContent = 'Listening for command...';
    addMessage('🎤 Listening... Speak now!', false);
  };
  
  recognition.onresult = (event) => {
    console.log('Recognition result received');
    const transcript = event.results[0][0].transcript;
    console.log('Transcript:', transcript);
    commandInput.value = transcript;
    addMessage(`You said: "${transcript}"`, true);
    sendCommand();
  };
  
  recognition.onend = () => {
    console.log('Recognition ended');
    isListening = false;
    voiceBtn.classList.remove('listening');
    statusDot.classList.remove('listening');
    statusText.textContent = 'Ready';
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    addMessage(`❌ Error: ${event.error}. Please check microphone permissions.`, false);
    isListening = false;
    voiceBtn.classList.remove('listening');
    statusDot.classList.remove('listening');
    statusText.textContent = 'Ready';
  };
  
} else {
  console.error('Speech recognition not supported');
  voiceBtn.style.display = 'none';
  addMessage('Voice recognition is not supported in your browser.', false);
}

function speak(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
  }
}

function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'jarvis-message'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = text;
  
  messageDiv.appendChild(contentDiv);
  
  const welcomeMsg = chatContainer.querySelector('.welcome-message');
  if (welcomeMsg) {
    welcomeMsg.remove();
  }
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendCommand() {
  const command = commandInput.value.trim();
  if (!command) return;
  
  console.log('Sending command:', command);
  
  addMessage(command, true);
  commandInput.value = '';
  
  statusDot.classList.add('processing');
  statusText.textContent = 'Processing...';
  
  try {
    const response = await fetch('/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command })
    });
    
    const result = await response.json();
    console.log('Result:', result);
    
    addMessage(result.response, false);
    speak(result.response);
    
    if (result.action === 'search' && result.query) {
      setTimeout(() => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(result.query)}`, '_blank');
      }, 1000);
    }
    
  } catch (error) {
    console.error('Error:', error);
    addMessage('Sorry, I encountered an error.', false);
  }
  
  statusDot.classList.remove('processing');
  statusText.textContent = 'Ready';
}

sendBtn.addEventListener('click', sendCommand);

commandInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendCommand();
  }
});

voiceBtn.addEventListener('click', () => {
  if (!recognition) {
    addMessage('❌ Speech recognition not available', false);
    return;
  }
  
  if (isListening) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch (error) {
      console.error('Error:', error);
      addMessage('❌ Could not start microphone', false);
    }
  }
});

setTimeout(() => {
  speak('Hello! I am JARVIS, your virtual assistant.');
  addMessage('👋 Hello! I am JARVIS. Type or click the microphone!', false);
  addMessage('💡 Try: "hello", "what time is it"', false);
}, 1000);