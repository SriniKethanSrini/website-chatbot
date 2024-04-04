// Load Knowledge Base from text file
function loadKnowledgeBase(callback) {
    fetch('knowledge_base.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const knowledgeBase = {};
            lines.forEach(line => {
                const parts = line.split('::');
                if (parts.length === 2) {
                    knowledgeBase[parts[0].trim()] = parts[1].trim();
                }
            });
            callback(knowledgeBase);
        })
        .catch(error => console.error('Error loading knowledge base:', error));
}

// Analyze input against knowledge base
function analyzeInput(inputText, knowledgeBase) {
    let response = "I'm sorry, I don't understand.";
    for (let pattern in knowledgeBase) {
        let regex = new RegExp(pattern, 'i');
        if (regex.test(inputText)) {
            response = knowledgeBase[pattern];
            break;
        }
    }
    return response;
}

// Function to add a message to the chat box
function addMessageToChatBox(message, isUser = false) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
    messageDiv.textContent = message;
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

        // Analyze user input and generate bot response
        loadKnowledgeBase(knowledgeBase => {
            const botResponse = analyzeInput(userMessage, knowledgeBase);
            addMessageToChatBox(botResponse);
        });
    }
}

// Add event listener for Enter key press
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
