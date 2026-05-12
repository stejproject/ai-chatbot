/**
 * IntentDatabase - Manages chatbot intents and pattern matching
 */
class IntentDatabase {
    constructor() {
        this.intents = [];
        this.loadDefault();
    }

    loadDefault() {
        const defaultData = `greeting|halo,hai,pagi,salam,selamat pagi,selamat sore,selamat malam,apa kabar,gimana|Halo! Bagaimana kabar Anda?
greeting|assalamu alaikum,assalamualaikum,salam sejahtera|Walaikum assalam! Apa yang bisa saya bantu?
farewell|bye,sampai jumpa,goodbye,dada,dadah,sampai nanti,see you|Sampai jumpa! Semoga hari Anda menyenangkan.
farewell|terima kasih,thanks,makasih,tq|Sama-sama! Senang berbicara dengan Anda.
joke|buat joke,lawak,humor,bercanda|Kenapa ayam menyeberang? Karena di seberang ada KFC!
joke|joke lagi,humor lagi|Programmer itu seperti obat, jika dosisnya salah maka hasil yang diperoleh bukan obat tapi racun.
help|bantuan,help,apa saja yang bisa kamu lakukan,fitur apa|Saya bisa membantu dengan:
- Menjawab pertanyaan umum
- Memberikan informasi
- Membuat jokes
- Chat santai
- Dan banyak lagi! Coba tanyakan sesuatu!
help|siapa kamu,who are you,apa nama mu|Saya adalah AI Chatbot Assistant. Saya di sini untuk membantu dan menemani Anda.
weather|cuaca hari ini,berapa suhu,bagaimana cuaca,weather today|Maaf, saya tidak memiliki akses data cuaca real-time. Silakan periksa aplikasi cuaca atau weather.com
time|jam berapa,berapa jam,what time|Saya tidak bisa memberitahu waktu secara akurat, silakan lihat jam di perangkat Anda.
name|siapa nama mu,nama mu siapa,nama kamu|Nama saya adalah Assistant. Anda bisa menggantinya di pengaturan!
status|apa kabar,bagaimana kabar mu,bagaimana keadaan mu|Saya baik-baik saja! Terima kasih sudah bertanya. Bagaimana dengan Anda?
status|kamu OK,kamu baik baik saja|Ya, saya dalam kondisi prima! Siap membantu Anda kapan saja.
`;
        this.parseDatabase(defaultData);
    }

    parseDatabase(data) {
        this.intents = [];
        const lines = data.trim().split('\n');
        
        lines.forEach(line => {
            if (line.trim()) {
                const parts = line.split('|');
                if (parts.length === 3) {
                    const intent = parts[0].trim();
                    const patterns = parts[1].split(',').map(p => p.trim().toLowerCase());
                    const responses = parts[2].split(',').map(r => r.trim());
                    
                    this.intents.push({ intent, patterns, responses });
                }
            }
        });
    }

    getResponse(input, mode = 'intent') {
        const result = this.getResponseWithConfidence(input, mode);
        return result.response;
    }

    getResponseWithConfidence(input, mode = 'intent') {
        const inputLower = input.toLowerCase();
        
        if (mode === 'rule-based') {
            return this.getResponseRuleBasedWithConfidence(inputLower);
        } else if (mode === 'intent-based') {
            return this.getResponseIntentBasedWithConfidence(inputLower);
        }
        
        return {
            response: "Maaf, saya tidak memahami pertanyaan Anda. Coba ulangi dengan cara berbeda.",
            confidence: 0
        };
    }

    getResponseRuleBased(input) {
        const result = this.getResponseRuleBasedWithConfidence(input);
        return result.response;
    }

    getResponseRuleBasedWithConfidence(input) {
        for (const intent of this.intents) {
            for (const pattern of intent.patterns) {
                if (input.includes(pattern)) {
                    return {
                        response: this.selectRandomResponse(intent.responses),
                        confidence: 1.0
                    };
                }
            }
        }
        return {
            response: "Maaf, saya tidak memahami pertanyaan Anda. Coba ulangi dengan cara berbeda.",
            confidence: 0
        };
    }

    getResponseIntentBased(input) {
        const result = this.getResponseIntentBasedWithConfidence(input);
        return result.response;
    }

    getResponseIntentBasedWithConfidence(input) {
        let bestMatch = null;
        let bestScore = 0;

        for (const intent of this.intents) {
            for (const pattern of intent.patterns) {
                const score = this.calculateSimilarity(input, pattern);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = intent;
                }
            }
        }

        if (bestScore > 0.3) {
            return {
                response: this.selectRandomResponse(bestMatch.responses),
                confidence: bestScore
            };
        }
        
        return {
            response: "Maaf, saya tidak memahami pertanyaan Anda. Coba ulangi dengan cara berbeda.",
            confidence: bestScore
        };
    }

    calculateSimilarity(str1, str2) {
        const words1 = str1.split(' ');
        const words2 = str2.split(' ');
        let matches = 0;

        for (const word of words1) {
            if (words2.some(w => w.includes(word) || word.includes(w))) {
                matches++;
            }
        }

        return matches / Math.max(words1.length, words2.length);
    }

    selectRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

/**
 * OpenAIHandler - Manages LLM API calls
 */
class OpenAIHandler {
    constructor(apiKey = '') {
        this.apiKey = apiKey;
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        this.conversationHistory = [];
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    async getResponse(userMessage) {
        if (!this.apiKey) {
            return "API Key belum diatur. Silakan tambahkan OpenAI API Key di pengaturan.";
        }

        try {
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: this.conversationHistory,
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const error = await response.json();
                return `Error: ${error.error?.message || 'Unknown error occurred'}`;
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            return assistantMessage;
        } catch (error) {
            return `Error: ${error.message}. Pastikan API Key benar dan internet stabil.`;
        }
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IntentDatabase, OpenAIHandler };
}