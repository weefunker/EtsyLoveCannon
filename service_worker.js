// Service worker for Etsy Love Cannon extension

// Handle action button clicks (replaces browserAction.onClicked)
chrome.action.onClicked.addListener(function(tab) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['send_links.js']
    });
});

// Create context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "etsy-love-cannon",
        title: "Favorite/Unfavorite All",
        contexts: ["action"]
    });
    
    chrome.contextMenus.create({
        id: "clear-all-favorites",
        title: "Clear All Favorites",
        contexts: ["action"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "etsy-love-cannon") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['send_links.js']
        });
    } else if (info.menuItemId === "clear-all-favorites") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: clearAllFavorites
        });
    }
});

// Function to clear all favorites on the page
function clearAllFavorites() {
    // Prevent multiple executions
    const now = Date.now();
    if (window.etsyClearFavoritesState && (now - window.etsyClearFavoritesState.lastRun) < 2000) {
        console.log('Clear Favorites: Prevented duplicate execution');
        return;
    }
    
    window.etsyClearFavoritesState = { lastRun: now, isRunning: true };
    
    function findFavoritedItems() {
        // First, get all potential favorite buttons
        const allSelectors = [
            '[data-test-id="favorite-button"]',
            'button[aria-label*="Add to favorites"]',
            'button[aria-label*="Remove from favorites"]',
            'button[aria-label*="Favorite"]',
            '.btn-fave',
            '.favorite-button',
            '.shop-icon-favorite',
            '.icon-heart',
            '.etsy-icon[data-test-id*="favorite"]',
            'button[class*="favorite"]',
            'button[data-favorite]'
        ];
        
        const allButtons = [];
        allSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!allButtons.includes(element)) {
                    allButtons.push(element);
                }
            });
        });
        
        console.log(`Clear Favorites: Found ${allButtons.length} total favorite buttons`);
        
        // Filter to only favorited ones
        const favoritedButtons = allButtons.filter(button => {
            // Check screen reader text for "Remove from Favourites"
            const screenReaderText = button.querySelector('[data-a11y-label]')?.textContent?.trim();
            const isRemoveText = screenReaderText?.toLowerCase().includes('remove from favour');
            
            // Check if the favorited icon is visible (wt-display-block) and not-favorited is hidden (wt-display-none)
            const favoritedIcon = button.querySelector('[data-favorited-icon]');
            const notFavoritedIcon = button.querySelector('[data-not-favorited-icon]');
            
            const favoritedIconVisible = favoritedIcon?.classList.contains('wt-display-block');
            const notFavoritedIconHidden = notFavoritedIcon?.classList.contains('wt-display-none');
            
            // Check for specific Etsy favorited classes
            const hasAnimationClass = button.classList.contains('neu-favorite-cancel-animation');
            const hasOpacityFull = button.classList.contains('fav-opacity-full');
            
            const isFavorited = (
                isRemoveText ||
                (favoritedIconVisible && notFavoritedIconHidden) ||
                hasAnimationClass ||
                hasOpacityFull ||
                button.getAttribute('aria-pressed') === 'true' ||
                button.getAttribute('aria-label')?.toLowerCase().includes('remove from favorites') ||
                button.classList.contains('favorited') ||
                button.classList.contains('is-favorited')
            );
            
            if (isFavorited) {
                console.log('Found favorited item:', button, {
                    screenReaderText,
                    isRemoveText,
                    favoritedIconVisible,
                    notFavoritedIconHidden,
                    hasAnimationClass,
                    hasOpacityFull
                });
            }
            
            return isFavorited;
        });
        
        console.log(`Clear Favorites: Found ${favoritedButtons.length} favorited items`);
        return favoritedButtons;
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d32f2f;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    const favoritedButtons = findFavoritedItems();
    console.log(`Clear Favorites: Found ${favoritedButtons.length} favorited items`);
    
    if (favoritedButtons.length === 0) {
        showNotification('🤷 No favorited items found on this page');
        window.etsyClearFavoritesState.isRunning = false;
        return;
    }
    
    // Click all favorited items to unfavorite them
    favoritedButtons.forEach((button, index) => {
        setTimeout(() => button.click(), index * 100);
    });
    
    showNotification(`🗑️ Clearing ${favoritedButtons.length} favorites...`);
    
    // Mark as not running after all clicks are done
    setTimeout(() => {
        window.etsyClearFavoritesState.isRunning = false;
    }, (favoritedButtons.length * 100) + 500);
}

// Handle messages from content scripts (replaces chrome.extension.onRequest)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Forward messages to popup if needed
    return true;
});