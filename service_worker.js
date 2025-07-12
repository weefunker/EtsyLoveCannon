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

// Track executions to prevent double firing
let lastExecution = { time: 0, action: '' };

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const now = Date.now();
    const actionKey = `${info.menuItemId}_${tab.id}`;
    
    // Prevent duplicate executions within 2 seconds
    if (lastExecution.action === actionKey && (now - lastExecution.time) < 2000) {
        console.log('Service Worker: Prevented duplicate execution of', actionKey);
        return;
    }
    
    lastExecution = { time: now, action: actionKey };
    console.log('Service Worker: Executing', actionKey);
    
    if (info.menuItemId === "etsy-love-cannon") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['send_links.js']
        });
    } else if (info.menuItemId === "clear-all-favorites") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['clear_favorites_final.js']
        });
    }
});


// Handle messages from content scripts (replaces chrome.extension.onRequest)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Forward messages to popup if needed
    return true;
});