# Deploying JARVIS to Render

## 🚀 Quick Deploy to Render

### Method 1: One-Click Deploy (Easiest)

1. **Fork this repository** to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub account
5. Select the `jarvis-virtual-assistant` repository
6. Render will auto-detect settings from `render.yaml`
7. Click **"Create Web Service"**
8. Wait 2-3 minutes for deployment ✅

### Method 2: Manual Configuration

If auto-detection doesn't work, use these settings:

**Basic Settings:**
- **Name**: `jarvis-virtual-assistant`
- **Region**: Oregon (US West) or closest to you
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

**Advanced Settings:**
- **Auto-Deploy**: Yes (deploys on every git push)
- **Health Check Path**: `/health`

## 📋 Deployment Configuration

Your repository already includes:

✅ `render.yaml` - Auto-configuration file
✅ `package.json` - With engine version specified
✅ `server.js` - Uses `process.env.PORT`
✅ `.gitignore` - Excludes node_modules

## 🔧 Environment Variables (Optional)

No environment variables required! JARVIS works out of the box.

If you want to customize:
- `PORT` - Automatically set by Render (don't change)
- `NODE_VERSION` - Already set to 18.17.0 in render.yaml

## 🌐 After Deployment

Once deployed, you'll get a URL like:
```
https://jarvis-virtual-assistant.onrender.com
```

**Important Notes:**
- ⚠️ Free tier sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes ~30 seconds to wake up
- ✅ Voice features work perfectly on HTTPS
- ✅ Wake word detection works in deployed version

## 🎤 Using Voice Features on Render

**Browser Requirements:**
- Chrome, Edge, or Safari (best support)
- HTTPS required for microphone access (Render provides this)
- Allow microphone permissions when prompted

**Wake Word Detection:**
- Works perfectly on deployed version
- Say "Jarvis" to activate
- No configuration needed

## 🔄 Updating Your Deployment

Every time you push to GitHub, Render auto-deploys:

```bash
git add .
git commit -m "Update JARVIS"
git push origin main
```

Render will automatically rebuild and redeploy! 🎉

## 💰 Cost

**Free Tier Includes:**
- 750 hours/month (enough for personal use)
- Automatic HTTPS
- Custom domain support
- Auto-deploy from GitHub

**Limitations:**
- Sleeps after 15 min inactivity
- 512 MB RAM
- Shared CPU

**Upgrade to Paid ($7/month):**
- No sleep
- More resources
- Better performance

## 🐛 Troubleshooting

**Build Failed?**
- Check Node.js version in package.json
- Ensure all dependencies are in package.json
- Check Render build logs

**App Not Starting?**
- Verify `npm start` works locally
- Check if PORT is hardcoded (should use process.env.PORT)
- Review Render logs

**Voice Not Working?**
- Ensure you're using HTTPS (Render provides this)
- Allow microphone permissions
- Use Chrome/Edge/Safari browser

**App Sleeping?**
- Free tier sleeps after 15 min
- Upgrade to paid plan for 24/7 uptime
- Or use a service like UptimeRobot to ping it

## 📊 Monitoring

**Check App Status:**
- Render Dashboard → Your Service → Logs
- Health check: `https://your-app.onrender.com/health`

**View Logs:**
```bash
# In Render Dashboard
Services → jarvis-virtual-assistant → Logs
```

## 🎯 Alternative Deployment Options

### Vercel
```bash
npm install -g vercel
vercel
```

### Heroku
```bash
heroku create jarvis-assistant
git push heroku main
```

### Railway
1. Connect GitHub repo
2. Auto-detects Node.js
3. Deploys automatically

### Netlify (Static hosting won't work - needs Node.js server)

## 🔗 Custom Domain

**Add Custom Domain in Render:**
1. Go to Settings → Custom Domains
2. Add your domain (e.g., jarvis.yourdomain.com)
3. Update DNS records as shown
4. Wait for SSL certificate (automatic)

## ✅ Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Render account created
- [ ] Web service created and connected
- [ ] Build successful
- [ ] App accessible via URL
- [ ] Microphone permissions granted
- [ ] Wake word detection working
- [ ] Voice commands working

---

**Your JARVIS is now live on the internet! 🌐🤖**

Share your deployment URL and let others try your AI assistant!
