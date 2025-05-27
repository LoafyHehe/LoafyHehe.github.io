const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// HuggingFace Configuration
const HUGGINGCHAT_ENDPOINT = 'https://huggingface.co/chat/conversation';
const HF_TOKEN = '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';

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Initialize conversation
app.post('/api/chat/init', async (req, res) => {
    try {
        const response = await axios.post(HUGGINGCHAT_ENDPOINT, {}, {
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            conversationId: response.data.id
        });
    } catch (error) {
        console.error('Error initializing chat:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initialize conversation'
        });
    }
});

// Send message
app.post('/api/chat/message', async (req, res) => {
    try {
        const { message, conversationId, parameters } = req.body;

        if (!message || !conversationId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        // Prepare message data
        const messageData = {
            inputs: message,
            parameters: {
                max_new_tokens: parameters?.max_new_tokens || 100,
                temperature: parameters?.temperature || 0.7,
                top_p: parameters?.top_p || 0.9,
                top_k: parameters?.top_k || 50
            }
        };

        // Send message to HuggingFace
        const response = await axios.post(`${HUGGINGCHAT_ENDPOINT}/${conversationId}`, messageData, {
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            response: response.data.generated_text
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: error.response?.data?.error || 'Failed to send message'
        });
    }
});

// Serve static files
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
