# Etsy Love Cannon 💖

A Chrome extension that helps Etsy groups and collectors quickly favorite and unfavorite items on Etsy pages. Perfect for Etsy teams that need to support each other by favoriting items in bulk.

## Features

### 🎯 Multiple Favoriting Modes
- **Toggle Mode**: Click the extension icon to alternate between favoriting all unfavorited items and unfavoriting all favorited items
- **Favorite All**: Right-click context menu option to favorite only unfavorited items
- **Clear All Favorites**: Right-click context menu option to remove all favorites from the page

### 🛡️ Smart & Safe
- **Duplicate Protection**: Prevents accidental double-firing and rapid clicking
- **Visual Feedback**: Shows notifications with action count and status
- **Precise Detection**: Uses multiple methods to accurately detect favorited vs unfavorited items
- **Gentle Delays**: Staggers clicks to avoid overwhelming Etsy's servers

### 🔄 Chrome Extension Manifest V3
- Fully updated to the latest Chrome extension standards
- Uses service workers instead of background scripts
- Enhanced security and performance

## Installation

### Method 1: Load Unpacked (Developer Mode)

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/etsy-love-cannon.git
   cd etsy-love-cannon
   ```

2. **Enable Developer Mode in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `etsy-love-cannon` folder
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Etsy Love Cannon" and click the pin icon to keep it visible

### Method 2: Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store once it passes review.

## Usage

### Basic Usage
1. **Navigate to any Etsy page** with items (shop pages, search results, category pages, etc.)
2. **Click the Etsy Love Cannon icon** in your toolbar to toggle favorite/unfavorite all items
3. **Watch the notification** to see how many items were processed

### Advanced Usage
**Right-click the extension icon** for more options:
- **"Favorite All Items"**: Only favorites currently unfavorited items
- **"Clear All Favorites"**: Only removes currently favorited items
- **"Favorite/Unfavorite All (Toggle)"**: The default toggle behavior

### Visual Feedback
- **Orange notifications**: Favoriting actions (❤️)
- **Red notifications**: Unfavoriting/clearing actions (🗑️)
- **Gray notifications**: No action needed (🤷)

## How It Works

The extension uses vanilla JavaScript to:

1. **Detect favorite buttons** using multiple CSS selectors for Etsy's evolving UI
2. **Determine current state** by checking screen reader text and visual indicators
3. **Click buttons intelligently** with delays to prevent server overload
4. **Prevent duplicates** using DOM markers and execution tracking

### Supported Etsy Elements
- Modern favorite buttons (`[data-ui="favorite-listing-button"]`)
- Legacy favorite buttons (`.btn-fave`, `.favorite-button`)
- Heart icons and various button styles
- Screen reader accessibility text

## Technical Details

### File Structure
```
etsy-love-cannon/
├── manifest.json              # Extension manifest (v3)
├── service_worker.js          # Background service worker
├── send_links.js             # Toggle favorite/unfavorite functionality
├── favorite_all.js           # Favorite all unfavorited items
├── clear_favorites_final.js  # Clear all favorited items
├── popup.html               # Extension popup (legacy)
├── popup.js                 # Popup functionality (legacy)
├── jquery-3.2.1.js         # jQuery library (legacy)
├── logo.png                 # Extension icon
└── images/
    └── 128.png              # High-res icon
```

### Key Technologies
- **Chrome Extension Manifest V3**
- **Service Workers** (replaces background scripts)
- **Content Script Injection** via `chrome.scripting` API
- **Context Menus** for multiple action options
- **Vanilla JavaScript** (no dependencies for core functionality)

### Permissions Used
- `activeTab`: Access current tab when extension is used
- `contextMenus`: Right-click menu options
- `scripting`: Inject content scripts into Etsy pages
- `host_permissions`: Access to `https://www.etsy.com/*`

## Development

### Prerequisites
- Chrome browser (version 88+)
- Basic knowledge of JavaScript and Chrome extensions

### Local Development
1. Clone the repository
2. Make your changes
3. Go to `chrome://extensions/`
4. Click the reload icon on the Etsy Love Cannon extension
5. Test your changes on Etsy pages

### Debugging
- Open Chrome DevTools (F12) on Etsy pages to see console logs
- Check `chrome://extensions/` → Etsy Love Cannon → "Inspect views service worker" for background script logs
- Look for console messages starting with "Etsy Love Cannon:", "Clear Favorites:", or "Favorite All:"

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Areas for Improvement
- Support for other e-commerce platforms
- Additional filtering options
- Keyboard shortcuts
- Better visual feedback
- Performance optimizations

## Legal & Ethics

### ⚠️ Important Notes
- **Use Responsibly**: This tool is designed for legitimate Etsy community support, not spam or abuse
- **Respect Rate Limits**: The extension includes delays to be respectful of Etsy's servers
- **Terms of Service**: Ensure your usage complies with Etsy's Terms of Service
- **Community Guidelines**: Use this tool to support genuine community engagement

### Intended Use Cases
- **Etsy Teams**: Members supporting each other by favoriting team items
- **Collectors**: Quickly favoriting items in specific categories or from favorite shops
- **Shop Owners**: Favoriting inspiration or competitor research (within reasonable limits)

## Browser Compatibility

- **Chrome**: ✅ Fully supported (v88+)
- **Edge**: ✅ Should work (Chromium-based)
- **Firefox**: ❌ Not supported (uses Chrome extension APIs)
- **Safari**: ❌ Not supported

## Changelog

### v0.4 (Current)
- Updated to Chrome Extension Manifest V3
- Added context menu with multiple options
- Improved duplicate execution prevention
- Enhanced favorite state detection
- Added visual notifications
- Vanilla JavaScript implementation for better performance

### Previous Versions
- v0.3: Legacy jQuery-based implementation
- v0.2: Basic favoriting functionality
- v0.1: Initial release

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter issues or have questions:

1. **Check the Console**: Open DevTools and look for error messages
2. **Review Common Issues**: See the troubleshooting section below
3. **File an Issue**: Create a GitHub issue with details about your problem
4. **Join the Discussion**: Check existing issues and discussions

### Common Issues

**Q: Extension not working on some Etsy pages**
A: Etsy frequently updates their UI. The extension includes multiple fallback selectors, but new layouts might need updates.

**Q: Getting "No favorites found" when there are favorites**
A: This can happen if Etsy changes their HTML structure. Check the console for debugging info and file an issue.

**Q: Items getting favorited and unfavorited rapidly**
A: This shouldn't happen with the current version's duplicate protection. If it does, please file a bug report.

**Q: Extension not appearing in toolbar**
A: Make sure you've pinned it by clicking the puzzle piece icon and pinning "Etsy Love Cannon."

## Disclaimer

This extension is not affiliated with Etsy, Inc. Use at your own risk and in accordance with Etsy's Terms of Service. The developers are not responsible for any account issues that may result from using this tool.

## Support the Project

If this extension saves you time and helps your Etsy community, consider buying me a coffee! ☕

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support%20development-yellow.svg?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/o1rojygbbt)

Your support helps maintain and improve the extension with new features and bug fixes.

---

**Made with ❤️ for the Etsy community**

*If this extension helps you, consider starring the repository ⭐ or sharing it with others who might find it useful!*