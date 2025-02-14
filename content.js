chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'performSingleSearch') {
        const searchBox = document.querySelector('textarea.b_searchbox[id="sb_form_q"]');
        if (searchBox) {
            searchBox.value = message.stockSymbol;

            // Trigger Enter key event
            searchBox.dispatchEvent(new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                keyCode: 13
            }));

            console.log(`Performed search for: ${message.stockSymbol}`);
            sendResponse({ status: 'search_completed' });
        } else {
            console.error('Search input element not found.');
            sendResponse({ status: 'error', message: 'Search box not found' });
        }
    }
});
