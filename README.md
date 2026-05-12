# 🤖 AI Chatbot Assistant

AI Chatbot lengkap dengan database `.txt` yang fully customizable, mendukung 3 mode operasi: Rule-Based, Intent-Based, dan LLM (OpenAI).

## ✨ Fitur Utama

### 🎯 Tiga Mode Chatbot

1. **Rule-Based Mode** - Keyword matching sederhana
   - Cocok untuk chatbot dasar dengan pola kecocokan eksak
   - Respons cepat dan dapat diprediksi

2. **Intent-Based Mode** (Default) - Pattern matching dengan similarity calculation
   - Lebih cerdas dari rule-based
   - Mencocokkan intent bahkan jika pola tidak persis sama
   - Cocok untuk sebagian besar use case

3. **LLM Mode** - OpenAI API integration
   - AI yang benar-benar cerdas
   - Percakapan natural dan kontekstual
   - Memerlukan OpenAI API Key

### 💾 Database Management

- **Format Database**: `intent|pattern1,pattern2|response1,response2`
- **Upload Custom Database**: Upload file `.txt` custom Anda sendiri
- **Persistent Storage**: Database tersimpan di localStorage browser
- **Sample Database**: 15+ intents siap pakai dalam database default

### 💬 Chat Features

- ✅ Chat history dengan timestamp
- ✅ Typing indicator yang natural
- ✅ Dark/Light theme toggle
- ✅ Customizable warna pesan (User & Bot)
- ✅ Download chat history sebagai `.txt`
- ✅ Reset chat dengan satu klik
- ✅ Responsive design (Mobile & Desktop)

### ⚙️ Pengaturan Kustom

- Ubah nama bot
- Pilih warna pesan user dan bot
- Ganti tema (light/dark)
- Input OpenAI API Key (opsional)
- Upload custom database file

## 🚀 Cara Menggunakan

### 1. Buka di Browser
```
Buka file index.html di browser favorit Anda
```

### 2. Gunakan Mode Default (Intent-Based)
- Langsung bisa chat tanpa setup
- Menggunakan database bawaan
- Coba tanya: "Halo", "Bikin joke", "Siapa kamu?"

### 3. Mode Rule-Based (Opsional)
- Edit file `config.js` di class `ChatbotApp.sendMessage()`
- Ubah `this.mode = 'rule-based'`

### 4. Aktifkan Mode LLM (OpenAI)
- Klik ⚙️ (Settings) di sudut kanan atas
- Input OpenAI API Key Anda
- Klik "Simpan Pengaturan"
- Mode LLM otomatis aktif

### 5. Upload Custom Database
- Klik ⚙️ (Settings)
- Scroll ke "Upload Custom Database (TXT)"
- Pilih file `.txt` dengan format yang benar
- Klik "Simpan Pengaturan"

## 📝 Format Database

Database menggunakan format: `intent|pattern|response`

```
intent_name|pattern1,pattern2,pattern3|response1,response2
```

### Contoh:
```
greeting|halo,hai,pagi|Halo! Apa kabar?
greeting|assalamu alaikum|Walaikum assalam!
farewell|bye,sampai jumpa|Sampai jumpa!
weather|cuaca,weather|Saya tidak bisa mengecek cuaca real-time.
joke|buat joke,humor|Mengapa programmer itu sendirian? Karena mereka lebih suka chat dengan bot!
```

### Penjelasan Format:
- **intent_name**: Kategori intent (greeting, farewell, weather, dll)
- **pattern1,pattern2**: Pola input user (dipisah koma)
- **response1,response2**: Respon bot (dipisah koma, bot akan pilih random)

## 🔧 Struktur File

```
ai-chatbot/
├── index.html          # UI Chatbot
├── style.css           # Styling responsive
├── config.js           # Core classes (IntentDatabase, OpenAIHandler)
├── script.js           # Main app logic (ChatbotApp)
├── database.txt        # Sample database (15+ intents)
└── README.md           # Dokumentasi ini
```

## 📱 Fitur Teknis

### Classes & Objects

#### `IntentDatabase`
- `loadDefault()` - Load default database
- `parseDatabase(data)` - Parse database dari string
- `getResponse(input, mode)` - Get response berdasarkan mode
- `calculateSimilarity(str1, str2)` - Hitung similarity score

#### `OpenAIHandler`
- `setApiKey(key)` - Set OpenAI API Key
- `getResponse(message)` - Get response dari OpenAI
- `clearHistory()` - Reset conversation history

#### `ChatbotApp`
- `sendMessage()` - Handle user input
- `addMessage(sender, text, type)` - Add message ke chat
- `saveSettings()` - Save user settings ke localStorage
- `loadChatHistory()` - Load chat history dari localStorage
- `downloadChatHistory()` - Download chat sebagai .txt

### LocalStorage Keys

- `chatbot_settings` - User settings (nama, warna, tema, mode)
- `chatbot_history` - Chat history
- `chatbot_database` - Custom database

## 🎨 Customization

### Ubah Warna Default

Edit `style.css` - CSS variables:
```css
:root {
    --user-color: #4CAF50;    /* Warna pesan user */
    --bot-color: #2196F3;      /* Warna pesan bot */
    --bg-color: #f5f5f5;       /* Warna background */
    --text-color: #333;        /* Warna text */
    --border-color: #ddd;      /* Warna border */
}
```

### Ubah Mode Default

Edit `script.js` - baris ~10:
```javascript
this.mode = 'intent-based'; // Ubah ke 'rule-based' atau 'llm'
```

### Ubah Default Database

Edit `config.js` - method `loadDefault()` di class `IntentDatabase`

## 🔐 OpenAI API Key

### Cara Mendapatkan:

1. Kunjungi https://platform.openai.com/api-keys
2. Login dengan akun OpenAI Anda
3. Klik "Create new secret key"
4. Copy key tersebut
5. Paste di pengaturan chatbot

**⚠️ Penting**: 
- API Key disimpan di localStorage (browser local)
- Jangan share key Anda ke orang lain
- Monitor penggunaan API di dashboard OpenAI

## 💡 Tips & Tricks

1. **Kombinasi Mode**: Start dengan Intent-Based, upgrade ke LLM jika perlu
2. **Database Besar**: Untuk database besar, split menjadi beberapa file
3. **Backup**: Download chat history regularly untuk backup
4. **Performance**: Clear localStorage jika chatbot berjalan lambat
5. **Testing**: Uji database dengan berbagai pola sebelum production

## 🐛 Troubleshooting

### Chatbot tidak merespons
- Buka browser console (F12)
- Check apakah ada error messages
- Pastikan file `config.js` dan `script.js` loaded

### LLM mode tidak bekerja
- Pastikan API Key benar
- Check error message di chat
- Pastikan internet connection stabil
- Lihat quota di OpenAI dashboard

### Database tidak tersimpan
- Clear localStorage dan reload
- Check file format database
- Pastikan browser support localStorage

### Chat history hilang
- Check localStorage (F12 > Application > LocalStorage)
- Coba download history sebelum clear

## 📦 Dependency

Tidak ada dependency eksternal! 100% vanilla JavaScript.

## 📄 License

Free to use dan modify

## 🤝 Contributing

Feel free untuk fork, modify, dan improve!

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi penulis.

---

**Happy Chatting! 🚀**