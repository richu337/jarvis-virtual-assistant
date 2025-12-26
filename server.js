const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

function processCommand(command) {
  const cmd = command.toLowerCase().trim();
  
  // Greetings
  if (cmd.match(/^(hello|hi|hey|good morning|good evening)/)) {
    return { response: 'Hello! I am JARVIS. How may I help you?', action: 'speak' };
  }
  
  // Identity
  if (cmd.match(/who are you|what are you|your name/)) {
    return { response: 'I am JARVIS, Just A Rather Very Intelligent System. I am your personal desktop assistant.', action: 'speak' };
  }
  
  // Time
  if (cmd.match(/time|what time/)) {
    const time = new Date().toLocaleTimeString();
    return { response: `The current time is ${time}`, action: 'speak' };
  }
  
  // Date
  if (cmd.match(/date|what day|today/)) {
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return { response: `Today is ${date}`, action: 'speak' };
  }
  
  // Open applications (Web version limitation)
  if (cmd.match(/open (\w+)/)) {
    const app = cmd.match(/open (\w+)/)[1];
    
    // Web alternatives for common apps
    const webAlternatives = {
      'calculator': 'https://www.google.com/search?q=calculator',
      'notepad': 'https://www.google.com/search?q=online+notepad',
      'calendar': 'https://calendar.google.com',
      'mail': 'https://mail.google.com',
      'gmail': 'https://mail.google.com',
      'youtube': 'https://youtube.com',
      'maps': 'https://maps.google.com',
      'drive': 'https://drive.google.com',
      'docs': 'https://docs.google.com',
      'sheets': 'https://sheets.google.com'
    };
    
    if (webAlternatives[app]) {
      return { 
        response: `Opening ${app} in your browser...`, 
        action: 'open_url', 
        url: webAlternatives[app] 
      };
    } else {
      return { 
        response: `I cannot open desktop applications in web mode. However, I can search for ${app} online or open web-based alternatives. Try asking me to search for something instead!`, 
        action: 'speak' 
      };
    }
  }
  
  // Search
  if (cmd.match(/search|google|find/)) {
    const query = cmd.replace(/search|google|find|for|about/g, '').trim();
    return { response: `Searching for ${query}...`, action: 'search', query: query };
  }
  
  // Weather
  if (cmd.match(/weather/)) {
    return { response: 'Opening weather information...', action: 'search', query: 'weather today' };
  }
  
  // News
  if (cmd.match(/news/)) {
    return { response: 'Opening latest news...', action: 'search', query: 'latest news' };
  }
  
  // Help
  if (cmd.match(/help|what can you do|commands/)) {
    return { 
      response: 'I can help you with: Searching the web, Telling time and date, Opening web apps like Gmail, Calendar, YouTube, Providing weather updates, Reading news, and much more. Just ask me!', 
      action: 'speak' 
    };
  }
  
  // Thank you
  if (cmd.match(/thank you|thanks/)) {
    return { response: 'You are welcome! Happy to help.', action: 'speak' };
  }
  
  // Goodbye
  if (cmd.match(/bye|goodbye|exit|quit/)) {
    return { response: 'Goodbye! Have a great day!', action: 'speak' };
  }
  
  // Default
  return { response: 'I am not sure how to help with that. Try asking me to search something, tell you the time, or open a web app like Gmail or YouTube.', action: 'speak' };
}

app.post('/command', (req, res) => {
  const { command } = req.body;
  const result = processCommand(command);
  res.json(result);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'JARVIS is running' });
});

app.listen(PORT, () => {
  console.log(`🤖 JARVIS is running on port ${PORT}`);
});
