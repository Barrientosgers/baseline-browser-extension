// Background script for Baseline Browser Extension

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Baseline Browser Extension installed');
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentTabStats') {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const tabId = tabs[0].id;
        
        // Send message to content script to get stats
        chrome.tabs.sendMessage(tabId, { action: 'getPageStats' }, (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({ 
              success: false, 
              error: 'Could not communicate with content script. Make sure you are on a valid web page.' 
            });
          } else {
            sendResponse(response);
          }
        });
      } else {
        sendResponse({ 
          success: false, 
          error: 'No active tab found' 
        });
      }
    });
    
    return true; // Keep the message channel open for async response
  }
});

// Handle tab updates (optional - for future features)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Page has finished loading, could trigger analysis here
  }
});
