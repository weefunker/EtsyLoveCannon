

//Add all to favorite
$(".btn-fave").click()
//Favorite shop
$(".favorite-shop-action-text").click()
// Etsy Team Button Click
$(".button-spinner").click()
// fav all of the things
$(".etsy-icon.not-favorited").click()

//Perform actions only on click
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: "send_links.js"});
});

// Adding Fav to Context menu
chrome.contextMenus.create({
    title: "Etsy Love Canon",
    contexts:["browser_action"],  // ContextType
    onclick: $(".btn-fave").click()  // A callback function
});
