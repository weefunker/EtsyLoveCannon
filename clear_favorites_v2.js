// Clear favorites - ultra-precise version
(function() {
    // Absolutely prevent any duplicate execution
    const executionKey = 'etsyClear_' + Date.now();
    
    if (window.etsyClearExecuted) {
        console.log('Clear Favorites: Already executed, aborting');
        return;
    }
    
    window.etsyClearExecuted = true;
    console.log('Clear Favorites: Single execution starting', executionKey);
    
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
    
    // Find only genuinely favorited items
    function findOnlyFavoritedItems() {
        const allFavoriteButtons = document.querySelectorAll('[data-ui="favorite-listing-button"]');
        console.log(`Found ${allFavoriteButtons.length} total favorite buttons`);
        
        const genuinelyFavorited = [];
        
        allFavoriteButtons.forEach((button, index) => {
            // Check screen reader text first - most reliable indicator
            const screenReaderElement = button.querySelector('[data-a11y-label]');
            const screenReaderText = screenReaderElement ? screenReaderElement.textContent.trim() : '';
            
            // Check if it says "Remove from Favourites" (favorited) vs "Add to Favourites" (not favorited)
            const isActuallyFavorited = screenReaderText.toLowerCase().includes('remove from favour');
            
            // Also check for the visual indicators
            const hasOpacityFull = button.classList.contains('fav-opacity-full');
            const hasAnimationClass = button.classList.contains('neu-favorite-cancel-animation');
            
            // Check icon visibility
            const favoritedIcon = button.querySelector('[data-favorited-icon]');
            const notFavoritedIcon = button.querySelector('[data-not-favorited-icon]');
            const favoritedIconVisible = favoritedIcon && favoritedIcon.classList.contains('wt-display-block');
            const notFavoritedIconHidden = notFavoritedIcon && notFavoritedIcon.classList.contains('wt-display-none');
            
            console.log(`Button ${index + 1}:`, {
                screenReaderText,
                isActuallyFavorited,
                hasOpacityFull,
                hasAnimationClass,
                favoritedIconVisible,
                notFavoritedIconHidden
            });
            
            // Only add if it's genuinely favorited based on screen reader text
            if (isActuallyFavorited && (hasOpacityFull || hasAnimationClass || (favoritedIconVisible && notFavoritedIconHidden))) {
                genuinelyFavorited.push(button);
                console.log(`✓ Confirmed favorited item ${genuinelyFavorited.length}`);
            }
        });
        
        return genuinelyFavorited;
    }
    
    const favoritedButtons = findOnlyFavoritedItems();
    console.log(`Clear Favorites: Found ${favoritedButtons.length} genuinely favorited items`);
    
    if (favoritedButtons.length === 0) {
        showNotification('🤷 No favorited items found on this page');
        // Reset flag after delay to allow retry if needed
        setTimeout(() => { window.etsyClearExecuted = false; }, 5000);
        return;
    }
    
    showNotification(`🗑️ Clearing ${favoritedButtons.length} favorites...`);
    
    // Click each button exactly once with longer delays
    favoritedButtons.forEach((button, index) => {
        setTimeout(() => {
            console.log(`Clicking favorited button ${index + 1}/${favoritedButtons.length}`);
            button.click();
        }, index * 500); // Much longer delay - 500ms between clicks
    });
    
    // Reset the flag after everything is done to allow future executions
    setTimeout(() => {
        window.etsyClearExecuted = false;
        console.log('Clear Favorites: Execution complete, flag reset');
    }, (favoritedButtons.length * 500) + 2000);
    
})();