const commandInput = document.getElementById('commandInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const chatContainer = document.getElementById('chatContainer');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

let recognition = null;
let isListening = false;

// Initialize speech recognition if available
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add('listening');
    statusDot.classList.add('listening');
    statusText.textContent = 'Listening...';
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    commandInput.value = transcript;
    sendCommand();
  };
  
  recognition.onend = () => {
    isListening = false;
    voiceBtn.classList.remove('listening');
    statusDot.classList.remove('listening');
    statusText.textContent = 'Ready';
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    voiceBtn.classList.remove('listening');
    statusDot.classList.remove('listening');
    statusText.textContent = 'Ready';
  };
} else {
  voiceBtn.style.display = 'none';
}

// Text-to-speech function
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a more natural voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    speechSynthesis.speak(utterance);
  }
}

// Add message to chat
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'jarvis-message'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = text;
  
  messageDiv.appendChild(contentDiv);
  
  // Remove welcome message if it exists
  const welcomeMsg = chatContainer.querySelector('.welcome-message');
  if (welcomeMsg) {
    welcomeMsg.remove();
  }
  
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send command to server
async function sendCommand() {
  const command = commandInput.value.trim();
  if (!command) return;
  
  // Add user message
  addMessage(command, true);
  commandInput.value = '';
  
  // Update status
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
    
    // Add JARVIS response
    addMessage(result.response, false);
    
    // Speak the response
    speak(result.response);
    
    // Handle actions
    if (result.action === 'search' && result.query) {
      setTimeout(() => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(result.query)}`, '_blank');
      }, 1000);
    } else if (result.action === 'open' && result.app) {
      addMessage(`Note: Application opening is limited in web environment. In desktop version, ${result.app} would open now.`, false);
    }
    
  } catch (error) {
    console.error('Error:', error);
    addMessage('Sorry, I encountered an error processing your command.', false);
  }
  
  // Reset status
  statusDot.classList.remove('processing');
  statusText.textContent = 'Ready';
}

// Event listeners
sendBtn.addEventListener('click', sendCommand);

commandInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendCommand();
  }
});

voiceBtn.addEventListener('click', () => {
  if (recognition) {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }
});

// Load voices when available
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
  };
}

// Initial greeting
setTimeout(() => {
  speak('Hello! I am JARVIS, your virtual assistant. How may I help you today?');
}, 1000);
