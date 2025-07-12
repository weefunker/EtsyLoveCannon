// Clear all favorites content script
(function() {
    // Simple but effective lock
    if (window.etsyClearInProgress) {
        console.log('Clear Favorites: Already in progress, aborting');
        return;
    }
    
    // Set lock immediately
    window.etsyClearInProgress = true;
    console.log('Clear Favorites: Starting execution at', Date.now());
    
    function findFavoritedItems() {
        const allSelectors = [
            '[data-ui="favorite-listing-button"]',
            'button[data-favorite-label]',
            'button[class*="favorite"]'
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
        
        const favoritedButtons = allButtons.filter(button => {
            const screenReaderText = button.querySelector('[data-a11y-label]')?.textContent?.trim();
            const isRemoveText = screenReaderText?.toLowerCase().includes('remove from favour');
            
            const favoritedIcon = button.querySelector('[data-favorited-icon]');
            const notFavoritedIcon = button.querySelector('[data-not-favorited-icon]');
            
            const favoritedIconVisible = favoritedIcon?.classList.contains('wt-display-block');
            const notFavoritedIconHidden = notFavoritedIcon?.classList.contains('wt-display-none');
            
            const hasAnimationClass = button.classList.contains('neu-favorite-cancel-animation');
            const hasOpacityFull = button.classList.contains('fav-opacity-full');
            
            const isFavorited = (
                isRemoveText ||
                (favoritedIconVisible && notFavoritedIconHidden) ||
                hasAnimationClass ||
                hasOpacityFull
            );
            
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
    
    function cleanup() {
        window.etsyClearInProgress = false;
        console.log('Clear Favorites: Cleanup complete at', Date.now());
    }
    
    const favoritedButtons = findFavoritedItems();
    
    if (favoritedButtons.length === 0) {
        showNotification('🤷 No favorited items found on this page');
        cleanup();
        return;
    }
    
    showNotification(`🗑️ Clearing ${favoritedButtons.length} favorites...`);
    
    // Click each button only once
    let clickedCount = 0;
    favoritedButtons.forEach((button, index) => {
        setTimeout(() => {
            if (window.etsyClearInProgress) {
                console.log(`Clear Favorites: Clicking button ${index + 1}/${favoritedButtons.length}`);
                button.click();
                clickedCount++;
                
                // Cleanup after last click
                if (clickedCount === favoritedButtons.length) {
                    setTimeout(cleanup, 500);
                }
            }
        }, index * 200);
    });
    
})();