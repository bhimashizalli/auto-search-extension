// Add these functions at the beginning of your file
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // Update the theme toggle icon
  const icon = document.querySelector('.theme-toggle .icon');
  icon.textContent = theme === 'light' ? 'L' : 'D';
  chrome.storage.local.set({ theme });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Initialize search list from storage or default to empty array
let searchList = [];

let autoSearchInterval;

// Function to save search list to storage
function saveSearchList() {
  chrome.storage.local.set({ searchList });
}

// Function to save delay value
function saveDelayValue(delay) {
  chrome.storage.local.set({ delaySeconds: delay });
}

// Function to render search list
function renderSearchList() {
  const container = document.getElementById('searchList');
  container.innerHTML = '';

  searchList.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'search-item';
    div.innerHTML = `
      <span>${item}</span>
      <button class="remove-btn" data-index="${index}">x</button>
    `;
    container.appendChild(div);
  });
}

// Function to send a search request
function sendSearchRequest(stockSymbol, callback) {
  chrome.runtime.sendMessage({ action: 'performSingleSearch', stockSymbol }, (response) => {
    if (response?.status === 'search_started') {
      console.log(`Search started for: ${stockSymbol}`);
    }
    if (callback) callback(response);
  });
}

// Function to start the automatic search
function startAutomaticSearch() {
  let index = 0;
  const delaySeconds = parseInt(document.getElementById('delaySeconds').value, 10);

  // Clear existing interval if any
  if (autoSearchInterval) {
    clearInterval(autoSearchInterval);
  }

  autoSearchInterval = setInterval(() => {
    if (index < searchList.length) {
      sendSearchRequest(searchList[index]);
      index++;
    } else {
      clearInterval(autoSearchInterval);
    }
  }, delaySeconds * 1000);
}

// Update your loadSavedValues function
function loadSavedValues() {
  chrome.storage.local.get(['searchList', 'delaySeconds', 'theme'], (result) => {
    if (result.searchList) {
      searchList = result.searchList;
      renderSearchList();
    }
    if (result.delaySeconds) {
      document.getElementById('delaySeconds').value = result.delaySeconds;
    }
    if (result.theme) {
      setTheme(result.theme);
    }
  });
}

// Function to handle adding search terms
function addSearchTerm() {
  const input = document.getElementById('newSearch');
  const inputValue = input.value.trim();

  if (inputValue) {
    // Split input by commas and trim each value
    const newTerms = inputValue.split(',')
      .map(term => term.trim())
      .filter(term => term.length > 0);

    // Add all valid terms to the search list
    searchList.push(...newTerms);
    input.value = '';
    saveSearchList();
    renderSearchList();
  }
}

// Add event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Load saved values
  loadSavedValues();

  // Add new search term (click handler)
  document.getElementById('addSearch').addEventListener('click', addSearchTerm);

  // Add new search term (enter key handler)
  document.getElementById('newSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSearchTerm();
    }
  });

  // Remove search term
  document.getElementById('searchList').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const index = parseInt(e.target.dataset.index, 10);
      searchList.splice(index, 1);
      saveSearchList();
      renderSearchList();
    }
  });

  // Clear all search terms
  document.getElementById('clearAll').addEventListener('click', () => {
    searchList = [];
    saveSearchList();
    renderSearchList();
  });

  // Start automatic search
  document.getElementById('autoSearchButton').addEventListener('click', startAutomaticSearch);

  // Save delay value when changed
  document.getElementById('delaySeconds').addEventListener('change', (e) => {
    const delay = parseInt(e.target.value, 10);
    if (delay >= 1 && delay <= 60) {
      saveDelayValue(delay);
    }
  });

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});
