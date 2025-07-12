// Favorite all unfavorited items on page
(function() {
    // Create a unique marker on the page to prevent duplicate injections
    const markerId = 'etsy-favorite-all-marker';
    if (document.getElementById(markerId)) {
        console.log('Favorite All: Script already running, aborting');
        return;
    }
    
    // Create marker element
    const marker = document.createElement('div');
    marker.id = markerId;
    marker.style.display = 'none';
    document.body.appendChild(marker);
    
    console.log('Favorite All: Starting single execution');
    
    function showNotification(message) {
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
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // Take a snapshot of current state
    const allButtons = document.querySelectorAll('[data-ui="favorite-listing-button"]');
    console.log(`Found ${allButtons.length} favorite buttons total`);
    
    // Build array of only currently unfavorited buttons
    const currentlyUnfavorited = [];
    
    allButtons.forEach((button, index) => {
        const screenReader = button.querySelector('[data-a11y-label]');
        const text = screenReader ? screenReader.textContent.trim() : '';
        const isUnfavorited = text.toLowerCase().includes('add to favour');
        
        console.log(`Button ${index + 1}: "${text}" - ${isUnfavorited ? 'NOT favorited' : 'FAVORITED'}`);
        
        if (isUnfavorited) {
            currentlyUnfavorited.push({
                button: button,
                index: index,
                listingId: button.getAttribute('data-listing-id')
            });
        }
    });
    
    console.log(`Found ${currentlyUnfavorited.length} unfavorited items to favorite`);
    
    if (currentlyUnfavorited.length === 0) {
        showNotification('❤️ All items are already favorited!');
        // Remove marker after a delay
        setTimeout(() => {
            if (marker.parentNode) {
                marker.parentNode.removeChild(marker);
            }
        }, 3000);
        return;
    }
    
    showNotification(`❤️ Favoriting ${currentlyUnfavorited.length} items...`);
    
    // Click each unfavorited button exactly once
    let processedCount = 0;
    
    currentlyUnfavorited.forEach((item, arrayIndex) => {
        setTimeout(() => {
            // Verify the button still exists and is still unfavorited
            const currentScreenReader = item.button.querySelector('[data-a11y-label]');
            const currentText = currentScreenReader ? currentScreenReader.textContent.trim() : '';
            const stillUnfavorited = currentText.toLowerCase().includes('add to favour');
            
            if (stillUnfavorited) {
                console.log(`Favoriting item ${arrayIndex + 1}/${currentlyUnfavorited.length} (listing ${item.listingId})`);
                item.button.click();
            } else {
                console.log(`Skipping item ${arrayIndex + 1} - already favorited`);
            }
            
            processedCount++;
            
            // Clean up after processing all items
            if (processedCount === currentlyUnfavorited.length) {
                setTimeout(() => {
                    if (marker.parentNode) {
                        marker.parentNode.removeChild(marker);
                    }
                    console.log('Favorite All: Execution complete');
                }, 1000);
            }
        }, arrayIndex * 300); // 300ms between clicks
    });
    
})();