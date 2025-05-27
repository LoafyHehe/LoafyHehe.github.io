// HuggingFace Configuration
const HUGGINGCHAT_ENDPOINT = 'https://huggingface.co/chat/conversation';
const HF_TOKEN = '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';

// Initialize GRODM
async function initializeGRODM() {
    // Initialize headers with token
    const headers = {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
    };
    
    try {
        // Create new conversation
        const response = await fetch(HUGGINGCHAT_ENDPOINT, {
            method: 'POST',
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error('Failed to create conversation');
        }
        
        const data = await response.json();
        // Store conversation ID
        localStorage.setItem('huggingface_conversation_id', data.id);
        console.log('Conversation created successfully');
        updateStatusIndicator('SYSTEM ONLINE', true);
        
    } catch (error) {
        console.error('Failed to initialize chat:', error);
        updateStatusIndicator('CONNECTION ERROR', false);
    }
}

// Send message function
async function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add message to chat
    const chat = document.getElementById('chat-messages');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.textContent = message;
    chat.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Add loading indicator
    const loading = document.createElement('div');
    loading.className = 'message loading';
    loading.textContent = 'Processing...';
    chat.appendChild(loading);
    
    try {
        // Get conversation ID
        const conversationId = localStorage.getItem('huggingface_conversation_id');
        if (!conversationId) {
            throw new Error('No active conversation');
        }

        // Prepare message data
        const messageData = {
            inputs: message,
            parameters: {
                max_new_tokens: 100,
                temperature: 0.7,
                top_p: 0.9,
                top_k: 50
            }
        };

        // Send message to HuggingFace
        const response = await fetch(`${HUGGINGCHAT_ENDPOINT}/${conversationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const data = await response.json();
        
        // Remove loading indicator
        loading.remove();
        
        // Add AI response
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai';
        aiMessage.textContent = data.generated_text;
        chat.appendChild(aiMessage);
        
        // Scroll to bottom
        chat.scrollTop = chat.scrollHeight;
        
    } catch (error) {
        console.error('Error:', error);
        loading.textContent = 'Error processing request';
        updateStatusIndicator('CONNECTION ERROR', false);
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Update status indicator
function updateStatusIndicator(text, online = true) {
    const status = document.querySelector('.status-indicator');
    const dot = status.querySelector('.status-dot');
    
    status.querySelector('span').textContent = text;
    dot.style.backgroundColor = online ? '#4CAF50' : '#f44336';
}

// Theme management
function changeTheme(theme) {
    const root = document.documentElement;
    const themes = {
        'default': {
            '--primary-color': '#4CAF50',
            '--secondary-color': '#2196F3',
            '--background-color': '#1a1a1a',
            '--text-color': '#ffffff'
        },
        'dark': {
            '--primary-color': '#9C27B0',
            '--secondary-color': '#03A9F4',
            '--background-color': '#121212',
            '--text-color': '#e0e0e0'
        }
    };
    
    Object.entries(themes[theme]).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
}

// Custom CSS management
function applyCustomCSS() {
    const customCSS = localStorage.getItem('customCSS');
    if (customCSS) {
        const style = document.createElement('style');
        style.textContent = customCSS;
        document.head.appendChild(style);
    }
}

// Reset styles
function resetStyles() {
    const customStyle = document.querySelector('style[data-custom="true"]');
    if (customStyle) {
        customStyle.remove();
        localStorage.removeItem('customCSS');
    }
}

// Clear chat
function clearChat() {
    const chat = document.getElementById('chat-messages');
    chat.innerHTML = '';
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('huggingface_conversation_id');
    updateStatusIndicator('SYSTEM OFFLINE', false);
}

// View chat history
function viewChatHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
        const chat = document.getElementById('chat-messages');
        chat.innerHTML = history;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize GRODM
    await initializeGRODM();
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'default';
    changeTheme(savedTheme);
    
    // Apply custom CSS
    applyCustomCSS();
    
    // Restore chat history
    viewChatHistory();
});

// Focus input on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('message-input').focus();
});

// Handle Enter key for sending messages
document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Handle button click for sending messages
document.querySelector('.send-button').addEventListener('click', sendMessage);            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // Remove loading indicator
        loading.remove();
        
        // Add AI response
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai';
        aiMessage.textContent = data.response;
        chat.appendChild(aiMessage);
        
        // Scroll to bottom
        chat.scrollTop = chat.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        loading.textContent = 'Error processing request';
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Update status indicator
function updateStatusIndicator(text, online = true) {
    const status = document.querySelector('.status-indicator');
    const dot = status.querySelector('.status-dot');
    
    status.querySelector('span').textContent = text;
    dot.style.backgroundColor = online ? '#4CAF50' : '#f44336';
}

// Theme management
function changeTheme(theme) {
    const root = document.documentElement;
    const themes = {
        'default': {
            '--primary-color': '#4CAF50',
            '--secondary-color': '#2196F3',
            '--background-color': '#1a1a1a',
            '--text-color': '#ffffff'
        },
        'dark': {
            '--primary-color': '#9C27B0',
            '--secondary-color': '#03A9F4',
            '--background-color': '#121212',
            '--text-color': '#e0e0e0'
        }
    };
    
    Object.entries(themes[theme]).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
}

// Custom CSS management
function applyCustomCSS() {
    const customCSS = localStorage.getItem('customCSS');
    if (customCSS) {
        const style = document.createElement('style');
        style.textContent = customCSS;
        document.head.appendChild(style);
    }
}

// Reset styles
function resetStyles() {
    const customStyle = document.querySelector('style[data-custom="true"]');
    if (customStyle) {
        customStyle.remove();
        localStorage.removeItem('customCSS');
    }
}

// Clear chat
function clearChat() {
    const chat = document.getElementById('chat-messages');
    chat.innerHTML = '';
    localStorage.removeItem('chatHistory');
}

// View chat history
function viewChatHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
        const chat = document.getElementById('chat-messages');
        chat.innerHTML = history;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize GRODM
    await initializeGRODM();
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'default';
    changeTheme(savedTheme);
    
    // Apply custom CSS
    applyCustomCSS();
    
    // Restore chat history
    viewChatHistory();
});
