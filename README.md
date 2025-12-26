# JARVIS - Desktop Virtual Assistant

🤖 A privacy-focused, offline-capable virtual assistant with a modern web interface and **wake word detection**.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## ✨ Features

✅ **Wake Word Detection** - Just say "Jarvis" or "Hey Jarvis" to activate (no button press needed!)
✅ **Graphical User Interface** - Beautiful, responsive web-based UI
✅ **Voice Input/Output** - Speak commands and hear responses
✅ **System Control** - Open applications and execute commands
✅ **Web Search** - Search the web directly from JARVIS
✅ **Offline Intelligence** - Rule-based command processing
✅ **Privacy First** - No external APIs, all processing local
✅ **Cloud Ready** - Deploy to Render, Vercel, or Heroku

## 🎤 Wake Word Activation

JARVIS now features **continuous wake word detection**! Simply say:
- "Jarvis"
- "Hey Jarvis"
- "Ok Jarvis"
- "Hello Jarvis"

JARVIS will respond with "Yes, I am listening" and wait for your command. No need to press the mic button!

**Toggle Wake Word**: Click the 🎤 button to enable/disable wake word detection
- 🎤 Green dot = Wake word active
- 🔴 Red dot = Wake word disabled

## 💬 Commands You Can Try

- "Hello" / "Hi" - Greet JARVIS
- "What time is it?" - Get current time
- "What's the date?" - Get current date
- "Open calculator" - Open applications
- "Search for AI news" - Web search
- "Tell me the weather" - Weather information
- "What can you do?" - List capabilities
- "Who are you?" - Learn about JARVIS
- "Thank you" - Be polite!

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/richu337/jarvis-virtual-assistant.git

# Navigate to project directory
cd jarvis-virtual-assistant

# Install dependencies
npm install

# Start the server
npm start
```

Then open **http://localhost:3000** in your browser.

**Important**: Use Chrome, Edge, or Safari for best voice recognition support.

### 🌐 Deploy to Cloud

**Deploy to Render (Recommended):**

1. Fork this repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Click "Create Web Service" (auto-configured!)

**Deployment Settings:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free tier available

📖 **[Full Deployment Guide](DEPLOYMENT.md)** - Detailed instructions for Render, Vercel, Heroku, and more!

## 🛠️ Technology Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, JavaScript
- **Voice**: Web Speech API (built-in browser)
- **Wake Word**: Continuous speech recognition
- **UI**: Modern glassmorphism design
- **Deployment**: Render-ready with auto-configuration

## 🎯 Usage Tips

1. **Allow Microphone Access** - Browser will ask for permission on first use
2. **Speak Clearly** - Say wake word clearly for best detection
3. **Wait for Response** - JARVIS will say "Yes, I am listening" before accepting commands
4. **Toggle Wake Word** - Click 🎤 button to turn wake word on/off
5. **Type Commands** - You can also type commands if voice isn't working

## 🚀 How It Works

1. **Wake Word Detection** - JARVIS continuously listens for "Jarvis"
2. **Activation** - Says "Yes, I am listening" when activated
3. **Command Input** - Speak or type your command
4. **Processing** - Analyzes using pattern matching
5. **Action** - Executes the appropriate action
6. **Response** - Displays and speaks the result

## 🖥️ Desktop Version

For a full desktop version with system-level access:

1. **Use Electron** to wrap this web app
2. **Add native system integration** for real app launching
3. **Implement offline speech recognition** (Vosk/Whisper)
4. **Add more system automation** features

### Converting to Electron:

```bash
npm install electron --save-dev
```

Create `main.js`:
```javascript
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);
```

## 🔮 Future Enhancements

- [ ] Custom wake word configuration
- [ ] Multiple language support
- [ ] Task scheduling and reminders
- [ ] Plugin system for extensions
- [ ] System monitoring (CPU, RAM, etc.)
- [ ] Conversation memory and context
- [ ] Integration with smart home devices
- [ ] Custom command creation UI
- [ ] Mobile app version

## 🎨 Project Structure

```
jarvis-virtual-assistant/
├── public/
│   ├── index.html      # Main UI with wake word indicator
│   ├── style.css       # Glassmorphism styling
│   └── script.js       # Wake word detection & voice logic
├── server.js           # Backend server & command processing
├── package.json        # Dependencies
├── render.yaml         # Render deployment config
├── DEPLOYMENT.md       # Deployment guide
└── README.md          # Documentation
```

## 🔧 Troubleshooting

**Wake word not working?**
- Ensure microphone permissions are granted
- Use Chrome/Edge/Safari (Firefox has limited support)
- Check if mic is working in system settings
- Speak clearly and wait for status indicator

**Voice recognition errors?**
- Check internet connection (browser speech API needs it)
- Try refreshing the page
- Toggle wake word off and on again

**No sound output?**
- Check browser sound permissions
- Ensure system volume is up
- Try different browser

**Deployment issues?**
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting
- Check Render logs for errors
- Verify build and start commands

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

Ideas for contributions:
- Better wake word accuracy
- More command patterns
- UI improvements
- Additional features
- Bug fixes
- Documentation improvements

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Inspired by Iron Man's JARVIS
- Built with Web Speech API
- Designed for privacy and offline use
- Community-driven development

## 🔗 Links

- **GitHub**: https://github.com/richu337/jarvis-virtual-assistant
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: [Report bugs or request features](https://github.com/richu337/jarvis-virtual-assistant/issues)

---

**Built with ❤️ for privacy and intelligence**

Say "Jarvis" and start commanding! 🎤✨

**⭐ Star this repo if you find it useful!**
