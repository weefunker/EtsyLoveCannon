// Clear favorites - final bulletproof version
(function() {
    // Create a unique marker on the page to prevent duplicate injections
    const markerId = 'etsy-clear-favorites-marker';
    if (document.getElementById(markerId)) {
        console.log('Clear Favorites: Script already running, aborting');
        return;
    }
    
    // Create marker element
    const marker = document.createElement('div');
    marker.id = markerId;
    marker.style.display = 'none';
    document.body.appendChild(marker);
    
    console.log('Clear Favorites: Starting single execution');
    
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
    
    // Take a snapshot of current state
    const allButtons = document.querySelectorAll('[data-ui="favorite-listing-button"]');
    console.log(`Found ${allButtons.length} favorite buttons total`);
    
    // Build array of only currently favorited buttons
    const currentlyFavorited = [];
    
    allButtons.forEach((button, index) => {
        const screenReader = button.querySelector('[data-a11y-label]');
        const text = screenReader ? screenReader.textContent.trim() : '';
        const isFavorited = text.toLowerCase().includes('remove from favour');
        
        console.log(`Button ${index + 1}: "${text}" - ${isFavorited ? 'FAVORITED' : 'NOT favorited'}`);
        
        if (isFavorited) {
            currentlyFavorited.push({
                button: button,
                index: index,
                listingId: button.getAttribute('data-listing-id')
            });
        }
    });
    
    console.log(`Found ${currentlyFavorited.length} actually favorited items`);
    
    if (currentlyFavorited.length === 0) {
        showNotification('🤷 No favorited items found on this page');
        // Remove marker after a delay
        setTimeout(() => {
            if (marker.parentNode) {
                marker.parentNode.removeChild(marker);
            }
        }, 3000);
        return;
    }
    
    showNotification(`🗑️ Clearing ${currentlyFavorited.length} favorites...`);
    
    // Click each favorited button exactly once
    let processedCount = 0;
    
    currentlyFavorited.forEach((item, arrayIndex) => {
        setTimeout(() => {
            // Verify the button still exists and is still favorited
            const currentScreenReader = item.button.querySelector('[data-a11y-label]');
            const currentText = currentScreenReader ? currentScreenReader.textContent.trim() : '';
            const stillFavorited = currentText.toLowerCase().includes('remove from favour');
            
            if (stillFavorited) {
                console.log(`Clicking favorited item ${arrayIndex + 1}/${currentlyFavorited.length} (listing ${item.listingId})`);
                item.button.click();
            } else {
                console.log(`Skipping item ${arrayIndex + 1} - no longer favorited`);
            }
            
            processedCount++;
            
            // Clean up after processing all items
            if (processedCount === currentlyFavorited.length) {
                setTimeout(() => {
                    if (marker.parentNode) {
                        marker.parentNode.removeChild(marker);
                    }
                    console.log('Clear Favorites: Execution complete');
                }, 1000);
            }
        }, arrayIndex * 300); // 300ms between clicks
    });
    
})();