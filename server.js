const express = require('express');
const { exec } = require('child_process');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

// Function to open desktop applications
function openDesktopApp(appName) {
  const platform = os.platform();
  let command;

  const apps = {
    'calculator': {
      'win32': 'calc.exe',
      'darwin': 'open -a Calculator',
      'linux': 'gnome-calculator || kcalc'
    },
    'notepad': {
      'win32': 'notepad.exe',
      'darwin': 'open -a TextEdit',
      'linux': 'gedit || kate'
    },
    'chrome': {
      'win32': 'start chrome',
      'darwin': 'open -a "Google Chrome"',
      'linux': 'google-chrome'
    },
    'explorer': {
      'win32': 'explorer.exe',
      'darwin': 'open .',
      'linux': 'nautilus || dolphin'
    },
    'terminal': {
      'win32': 'start cmd',
      'darwin': 'open -a Terminal',
      'linux': 'gnome-terminal || konsole'
    }
  };

  if (apps[appName] && apps[appName][platform]) {
    command = apps[appName][platform];
    exec(command, (error) => {
      if (error) {
        console.error(`Error opening ${appName}:`, error);
        return false;
      }
      return true;
    });
    return true;
  }
  return false;
}

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
  
  // Open applications (Desktop version)
  if (cmd.match(/open (\w+)/)) {
    const app = cmd.match(/open (\w+)/)[1];
    
    // Try to open the desktop app
    const opened = openDesktopApp(app);
    
    if (opened) {
      return { 
        response: `Opening ${app}...`, 
        action: 'open_desktop',
        app: app
      };
    } else {
      return { 
        response: `I couldn't find ${app} on your system. Try asking me to search for it instead.`, 
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
      response: 'I can help you with: Opening applications, Searching the web, Telling time and date, Providing weather updates, Reading news, and much more. Just ask me!', 
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
  return { response: 'I am not sure how to help with that. Try asking me to open an application, search something, or tell you the time.', action: 'speak' };
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