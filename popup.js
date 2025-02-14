let searchList = [
  "share price of Tata Steel",
  "share price of Tata Consultancy Services (TCS)",
  "share price of Tata Motors",
  "share price of Tata Power",
  "share price of Tata Chemicals",
  "share price of Tata Global Beverages",
  "share price of Tata Consumer Products",
  "share price of Tata Communications",
  "share price of Tata Teleservices",
  "share price of Tata Group",
  "share price of Tata Capital",
  "share price of Tata Elxsi",
  "share price of Tata Financial Services",
  "share price of Tata Trusts",
  "share price of Tata International",
  "share price of Tata AutoComp Systems",
  "share price of Tata Projects",
  "share price of Tata Projects Ltd.",
  "share price of Tata Swach",
  "share price of Tata AIG",
  "share price of Tata Retail",
  "share price of Tata Sky",
  "share price of Tata Motors Finance",
  "share price of Tata Tea",
  "share price of Tata Starbucks",
  "share price of Tata Housing Development Company",
  "share price of Tata Renewables",
  "share price of Tata Advanced Systems",
  "share price of Tata Aerospace & Defence",
  "share price of Tata Research Development & Design Centre",
  "share price of Tata Ficosa Automotive"
];

let autoSearchInterval;

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

  autoSearchInterval = setInterval(() => {
    if (index < searchList.length) {
      sendSearchRequest(searchList[index]);
      index++;
    } else {
      clearInterval(autoSearchInterval);
    }
  }, 7000); // 7 seconds delay
}

// Add event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // document.getElementById('singleSearchButton').addEventListener('click', () => {
  //   sendSearchRequest(searchList[0]);
  // });

  document.getElementById('autoSearchButton').addEventListener('click', startAutomaticSearch);
});
