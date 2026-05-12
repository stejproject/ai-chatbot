/**
 * ChatbotApp - Main application controller
 */
class ChatbotApp {
    constructor() {
        this.intents = new IntentDatabase();
        this.llm = new OpenAIHandler();
        this.chatHistory = [];
        this.mode = 'intent-based'; // 'rule-based', 'intent-based', or 'llm'
        this.botName = 'Assistant';
        this.userColor = '#4CAF50';
        this.botColor = '#2196F3';
        this.theme = 'light';

        this.initializeDOMElements();
        this.attachEventListeners();
        this.loadSettings();
        this.loadChatHistory();
    }

    initializeDOMElements() {
        // Settings
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.botNameInput = document.getElementById('botName');
        this.userColorInput = document.getElementById('userColor');
        this.botColorInput = document.getElementById('botColor');
        this.themeSelect = document.getElementById('theme');
        this.apiKeyInput = document.getElementById('apiKey');
        this.databaseInput = document.getElementById('database');
        this.saveSettingBtn = document.getElementById('saveSetting');
        this.resetChatBtn = document.getElementById('resetChat');

        // Chat
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
    }

    attachEventListeners() {
        this.settingsBtn.addEventListener('click', () => this.toggleSettings());
        this.saveSettingBtn.addEventListener('click', () => this.saveSettings());
        this.resetChatBtn.addEventListener('click', () => this.resetChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.downloadBtn.addEventListener('click', () => this.downloadChatHistory());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.databaseInput.addEventListener('change', (e) => this.handleDatabaseUpload(e));
    }

    toggleSettings() {
        this.settingsPanel.classList.toggle('active');
    }

    saveSettings() {
        this.botName = this.botNameInput.value || 'Assistant';
        this.userColor = this.userColorInput.value;
        this.botColor = this.botColorInput.value;
        this.theme = this.themeSelect.value;
        const apiKey = this.apiKeyInput.value.trim();
        
        if (apiKey) {
            this.mode = 'llm';
            this.llm.setApiKey(apiKey);
            this.addMessage('Bot', 'Mode LLM diaktifkan! Saya siap menggunakan OpenAI API.', 'bot');
        } else {
            this.mode = 'intent-based';
            this.addMessage('Bot', 'Mode Intent-Based diaktifkan. Chatbot berbasis aturan siap digunakan.', 'bot');
        }

        this.applyTheme();
        this.applyChatColors();
        localStorage.setItem('chatbot_settings', JSON.stringify({
            botName: this.botName,
            userColor: this.userColor,
            botColor: this.botColor,
            theme: this.theme,
            mode: this.mode
        }));

        this.settingsPanel.classList.remove('active');
        alert('Pengaturan disimpan!');
    }

    loadSettings() {
        const saved = localStorage.getItem('chatbot_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.botName = settings.botName;
            this.userColor = settings.userColor;
            this.botColor = settings.botColor;
            this.theme = settings.theme;
            this.mode = settings.mode;

            this.botNameInput.value = this.botName;
            this.userColorInput.value = this.userColor;
            this.botColorInput.value = this.botColor;
            this.themeSelect.value = this.theme;

            this.applyTheme();
            this.applyChatColors();
        }
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    applyChatColors() {
        document.documentElement.style.setProperty('--user-color', this.userColor);
        document.documentElement.style.setProperty('--bot-color', this.botColor);
    }

    handleDatabaseUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    this.intents.parseDatabase(e.target.result);
                    localStorage.setItem('chatbot_database', e.target.result);
                    this.addMessage('Bot', 'Database custom berhasil dimuat! Saya sudah siap dengan pengetahuan baru.', 'bot');
                } catch (error) {
                    alert('Error membaca file: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    }

    loadDatabase() {
        const saved = localStorage.getItem('chatbot_database');
        if (saved) {
            this.intents.parseDatabase(saved);
        }
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage('You', message, 'user');
        this.userInput.value = '';
        this.userInput.focus();

        // Show typing indicator
        this.showTypingIndicator();

        // Get bot response
        let response;
        try {
            if (this.mode === 'llm') {
                response = await this.llm.getResponse(message);
            } else {
                response = this.intents.getResponse(message, this.mode);
            }
        } catch (error) {
            response = 'Error: Terjadi kesalahan. ' + error.message;
        }

        // Hide typing indicator
        this.hideTypingIndicator();

        // Add bot message with delay
        setTimeout(() => {
            this.addMessage(this.botName, response, 'bot');
        }, 300);
    }

    addMessage(sender, text, type) {
        const timestamp = new Date().toLocaleTimeString('id-ID');
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type + '-message');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text;

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('message-time');
        timeSpan.textContent = timestamp;

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);
        this.chatMessages.appendChild(messageDiv);

        // Store in history
        this.chatHistory.push({ sender, text, type, timestamp });
        this.saveChatHistory();

        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        this.typingIndicator.classList.add('active');
    }

    hideTypingIndicator() {
        this.typingIndicator.classList.remove('active');
    }

    resetChat() {
        if (confirm('Apakah Anda yakin ingin mereset chat?')) {
            this.chatMessages.innerHTML = '';
            this.chatHistory = [];
            localStorage.removeItem('chatbot_history');
            this.llm.clearHistory();
            this.addMessage(this.botName, 'Chat telah direset. Mari mulai percakapan baru!', 'bot');
        }
    }

    saveChatHistory() {
        localStorage.setItem('chatbot_history', JSON.stringify(this.chatHistory));
    }

    loadChatHistory() {
        this.loadDatabase();
        const saved = localStorage.getItem('chatbot_history');
        if (saved) {
            try {
                this.chatHistory = JSON.parse(saved);
                this.chatHistory.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message', msg.type + '-message');

                    const contentDiv = document.createElement('div');
                    contentDiv.classList.add('message-content');
                    contentDiv.textContent = msg.text;

                    const timeSpan = document.createElement('span');
                    timeSpan.classList.add('message-time');
                    timeSpan.textContent = msg.timestamp;

                    messageDiv.appendChild(contentDiv);
                    messageDiv.appendChild(timeSpan);
                    this.chatMessages.appendChild(messageDiv);
                });
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }
    }

    downloadChatHistory() {
        let content = 'Chat History\n';
        content += '='.repeat(50) + '\n\n';

        this.chatHistory.forEach(msg => {
            content += `[${msg.timestamp}] ${msg.sender}: ${msg.text}\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().getTime()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotApp = new ChatbotApp();
});