const commandInput = document.getElementById('commandInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const chatContainer = document.getElementById('chatContainer');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

let recognition = null;
let wakeWordRecognition = null;
let isListening = false;
let isWakeWordActive = true;

// Initialize speech recognition if available
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  // Main command recognition
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add('listening');
    statusDot.classList.add('listening');
    statusText.textContent = 'Listening for command...';
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
    
    // Restart wake word detection after command is processed
    setTimeout(() => {
      if (isWakeWordActive) {
        startWakeWordDetection();
      }
    }, 1000);
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    voiceBtn.classList.remove('listening');
    statusDot.classList.remove('listening');
    statusText.textContent = 'Ready';
    
    // Restart wake word detection on error
    setTimeout(() => {
      if (isWakeWordActive) {
        startWakeWordDetection();
      }
    }, 1000);
  };
  
  // Wake word detection (continuous listening)
  wakeWordRecognition = new SpeechRecognition();
  wakeWordRecognition.continuous = true;
  wakeWordRecognition.interimResults = true;
  wakeWordRecognition.lang = 'en-US';
  
  wakeWordRecognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('')
      .toLowerCase();
    
    // Check for wake words
    if (transcript.includes('jarvis') || 
        transcript.includes('hey jarvis') || 
        transcript.includes('ok jarvis') ||
        transcript.includes('hello jarvis')) {
      
      // Stop wake word detection
      wakeWordRecognition.stop();
      
      // Play activation sound/feedback
      speak('Yes, I am listening');
      
      // Start command recognition after a short delay
      setTimeout(() => {
        if (!isListening) {
          recognition.start();
        }
      }, 1500);
    }
  };
  
  wakeWordRecognition.onerror = (event) => {
    if (event.error === 'no-speech' || event.error === 'audio-capture') {
      // Restart wake word detection on common errors
      setTimeout(() => {
        if (isWakeWordActive && !isListening) {
          startWakeWordDetection();
        }
      }, 1000);
    }
  };
  
  wakeWordRecognition.onend = () => {
    // Auto-restart wake word detection if it stops
    if (isWakeWordActive && !isListening) {
      setTimeout(() => {
        startWakeWordDetection();
      }, 500);
    }
  };
  
} else {
  voiceBtn.style.display = 'none';
  addMessage('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.', false);
}

// Start wake word detection
function startWakeWordDetection() {
  if (wakeWordRecognition && !isListening) {
    try {
      wakeWordRecognition.start();
      statusText.textContent = 'Say "Jarvis" to activate';
      statusDot.style.background = '#00ff88';
    } catch (error) {
      console.log('Wake word detection already running');
    }
  }
}

// Stop wake word detection
function stopWakeWordDetection() {
  if (wakeWordRecognition) {
    isWakeWordActive = false;
    wakeWordRecognition.stop();
    statusText.textContent = 'Wake word disabled';
    statusDot.style.background = '#ff6666';
  }
}

// Toggle wake word detection
function toggleWakeWord() {
  if (isWakeWordActive) {
    stopWakeWordDetection();
    voiceBtn.textContent = '🔴';
    voiceBtn.title = 'Wake word OFF - Click to enable';
  } else {
    isWakeWordActive = true;
    startWakeWordDetection();
    voiceBtn.textContent = '🎤';
    voiceBtn.title = 'Wake word ON - Say "Jarvis" to activate';
  }
}

// Text-to-speech function
function speak(text) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
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
    } else if (result.action === 'open_url' && result.url) {
      setTimeout(() => {
        window.open(result.url, '_blank');
      }, 1000);
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

// Voice button now toggles wake word detection
voiceBtn.addEventListener('click', toggleWakeWord);

// Load voices when available
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
  };
}

// Initial greeting and start wake word detection
setTimeout(() => {
  speak('Hello! I am JARVIS, your virtual assistant. Say "Jarvis" anytime to activate me.');
  addMessage('👋 Wake word detection is active! Just say "Jarvis" or "Hey Jarvis" to activate voice commands.', false);
  addMessage('💡 Note: This is the web version. I can open web apps like Gmail, Calendar, and YouTube, but cannot open desktop applications.', false);
  
  // Start wake word detection after greeting
  setTimeout(() => {
    startWakeWordDetection();
  }, 5000);
}, 1000);
