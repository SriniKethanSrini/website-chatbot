// Function to fetch data from Wikipedia based on user input
function fetchDataFromWikipedia(query, callback) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            const extract = pages[pageId].extract;
            callback(extract);
        })
        .catch(error => {
            console.error('Error fetching data from Wikipedia:', error);
            callback("I'm sorry, I couldn't find information on that.");
        });
}

// Function to fetch data from BBC News based on user input
function fetchDataFromBBCNews(query, callback) {
    const url = `https://www.bbc.co.uk/search?q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => response.text())
        .then(html => {
            // Parse HTML to extract relevant information
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const articles = doc.querySelectorAll('.search-results .css-1uhnxhu-StyledCard');

            let results = '';
            articles.forEach(article => {
                const title = article.querySelector('.css-1t7t0sf-Contributor').textContent.trim();
                const summary = article.querySelector('.css-lx00nm-Paragraph').textContent.trim();
                results += `<strong>${title}</strong>: ${summary}<br><br>`;
            });

            callback(results);
        })
        .catch(error => {
            console.error('Error fetching data from BBC News:', error);
            callback("I'm sorry, I couldn't find information on that from BBC News.");
        });
}

// Function to fetch data from multiple websites based on user input
function fetchDataFromWebsites(query) {
    fetchDataFromWikipedia(query, wikipediaData => {
        addMessageToChatBox(wikipediaData);
    });

    fetchDataFromBBCNews(query, bbcNewsData => {
        addMessageToChatBox(bbcNewsData);
    });
}

// Function to add a message to the chat box
function addMessageToChatBox(message, isUser = false) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
    messageDiv.innerHTML = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send user message
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();
    if (userMessage !== '') {
        addMessageToChatBox(userMessage, true);
        userInput.value = '';

        // Fetch data from multiple websites based on user input
        fetchDataFromWebsites(userMessage);
    }
}

// Add event listener for Enter key press
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});


