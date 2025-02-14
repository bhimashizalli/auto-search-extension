chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'performSingleSearch') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        }, () => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'performSingleSearch', stockSymbol: message.stockSymbol }, sendResponse);
        });
      } else {
        console.error('No active tab found.');
        sendResponse({ status: 'error', message: 'No active tab' });
      }
    });
    return true; // Keep the message channel open for sendResponse
  }
});
