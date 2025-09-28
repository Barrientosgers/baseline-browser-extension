// Content script to analyze HTML tags and JavaScript functions on web pages

// Function to get all HTML tags and their counts
function getHtmlTagStats() {
  const allElements = document.querySelectorAll('*');
  const tagCounts = {};
  
  allElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
  });
  
  // Sort by count (descending)
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
}

// Function to get JavaScript functions used on the page
function getJavaScriptFunctionStats() {
  const functions = new Set();
  
  // Get all script tags and analyze their content
  const scriptTags = document.querySelectorAll('script');
  scriptTags.forEach(script => {
    if (script.textContent) {
      // Extract function calls and definitions
      const functionMatches = script.textContent.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/g);
      if (functionMatches) {
        functionMatches.forEach(match => {
          const funcName = match.replace(/\s*\($/, '');
          if (funcName && !funcName.match(/^(if|for|while|switch|catch|function|return|new|typeof|instanceof)$/)) {
            functions.add(funcName);
          }
        });
      }
    }
  });
  
  // Also check for inline event handlers and other JS usage
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    // Check onclick, onload, etc.
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      if (attr.name.startsWith('on') && attr.value) {
        const functionMatches = attr.value.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/g);
        if (functionMatches) {
          functionMatches.forEach(match => {
            const funcName = match.replace(/\s*\($/, '');
            if (funcName && !funcName.match(/^(if|for|while|switch|catch|function|return|new|typeof|instanceof)$/)) {
              functions.add(funcName);
            }
          });
        }
      }
    }
  });
  
  // Convert to array and sort
  return Array.from(functions).sort();
}

// Function to get page metadata
function getPageMetadata() {
  return {
    url: window.location.href,
    title: document.title,
    domain: window.location.hostname,
    timestamp: new Date().toISOString()
  };
}

// Main function to collect all statistics
function collectPageStats() {
  return {
    metadata: getPageMetadata(),
    htmlTags: getHtmlTagStats(),
    jsFunctions: getJavaScriptFunctionStats(),
    totalElements: document.querySelectorAll('*').length,
    totalScripts: document.querySelectorAll('script').length
  };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageStats') {
    try {
      const stats = collectPageStats();
      sendResponse({ success: true, data: stats });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Keep the message channel open for async response
});

// Auto-collect stats when page loads (optional)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Page is fully loaded, stats are ready to be collected
  });
} else {
  // Page is already loaded
}
