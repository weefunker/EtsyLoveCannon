
// Etsy Love Cannon - Toggle favorite/unfavorite all items
(function() {
    // Prevent multiple executions within a short time
    const now = Date.now();
    if (window.etsyLoveCannonState && (now - window.etsyLoveCannonState.lastRun) < 2000) {
        console.log('Etsy Love Cannon: Prevented duplicate execution');
        return;
    }
    
    // Initialize or increment state
    if (window.etsyLoveCannonState) {
        window.etsyLoveCannonState.clickCount++;
        window.etsyLoveCannonState.lastRun = now;
    } else {
        window.etsyLoveCannonState = { 
            clickCount: 1, 
            lastRun: now,
            isRunning: false
        };
    }
    
    // Prevent overlapping executions
    if (window.etsyLoveCannonState.isRunning) {
        console.log('Etsy Love Cannon: Already running, skipping...');
        return;
    }
    
    window.etsyLoveCannonState.isRunning = true;
    const shouldFavorite = window.etsyLoveCannonState.clickCount % 2 === 1;
    
    function findFavoriteButtons() {
        const selectors = [
            // Modern Etsy favorite buttons
            '[data-test-id="favorite-button"]',
            'button[aria-label*="Add to favorites"]',
            'button[aria-label*="Remove from favorites"]',
            'button[aria-label*="Favorite"]',
            
            // Legacy selectors
            '.btn-fave',
            '.favorite-button',
            '.shop-icon-favorite',
            
            // Heart icons
            '.icon-heart',
            '.etsy-icon[data-test-id*="favorite"]',
            
            // Generic favorite buttons
            'button[class*="favorite"]',
            'button[data-favorite]'
        ];
        
        const buttons = [];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!buttons.includes(element)) {
                    buttons.push(element);
                }
            });
        });
        
        return buttons;
    }
    
    function isFavorited(button) {
        // Check various indicators that an item is already favorited
        return (
            button.getAttribute('aria-pressed') === 'true' ||
            button.getAttribute('aria-label')?.toLowerCase().includes('remove from favorites') ||
            button.classList.contains('favorited') ||
            button.classList.contains('is-favorited') ||
            button.querySelector('.favorited') ||
            button.querySelector('[aria-label*="Remove from favorites"]')
        );
    }
    
    function executeAction() {
        const buttons = findFavoriteButtons();
        let actionCount = 0;
        
        console.log(`Etsy Love Cannon: Found ${buttons.length} potential favorite buttons`);
        console.log(`Action: ${shouldFavorite ? 'FAVORITE' : 'UNFAVORITE'} all items`);
        
        buttons.forEach((button, index) => {
            const isCurrentlyFavorited = isFavorited(button);
            
            // Only click if the action matches what we want to do
            if (shouldFavorite && !isCurrentlyFavorited) {
                // Want to favorite and it's not favorited - click it
                setTimeout(() => button.click(), index * 100);
                actionCount++;
            } else if (!shouldFavorite && isCurrentlyFavorited) {
                // Want to unfavorite and it's favorited - click it
                setTimeout(() => button.click(), index * 100);
                actionCount++;
            }
        });
        
        console.log(`Etsy Love Cannon: Performing action on ${actionCount} items`);
        
        // Show user feedback
        const message = shouldFavorite ? 
            `❤️ Adding ${actionCount} items to favorites...` : 
            `💔 Removing ${actionCount} items from favorites...`;
            
        showNotification(message);
        
        // Mark as not running after all clicks are done
        setTimeout(() => {
            window.etsyLoveCannonState.isRunning = false;
        }, (buttons.length * 100) + 500);
    }
    
    function showNotification(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6600;
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
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // Execute the action once
    executeAction();
})();
