# MoodBoard – AI-Powered Emotional Wellness Platform

MoodBoard is an interactive emotion-intelligence platform that uses face-expression recognition, AI-driven recommendations, and human-connection systems to improve emotional well-being. Using webcam-based mood detection, MoodBoard provides personalized songs, quotes, AI conversations, mood analytics, and a unique LifeLine system that connects users with trusted individuals during moments of emotional distress.

---

## 🚀 Key Features

### 🎭 1. Real-Time Mood Detection
- Uses webcam input to detect facial expressions.
- Classifies mood (Happy, Sad, Neutral, Fear, etc.).
- Triggers personalized content and actions based on the detected mood.

### 🎵 2. Spotify-Powered Song Recommendations
- Mood-based playlists generated using the Spotify API.
- Songs update dynamically according to user emotions.

### 💬 3. Quote Recommendations via Quotify API
- Provides motivational or mood-specific quotes.
- Supports multiple moods with tailored inspiration.

### 🤖 4. Talk to an AI Companion
- Users can chat freely with an AI agent.
- Powered by Gemini AI for emotional and contextual conversations.
- Natural loop: user talks → AI responds → repeat.

### 📊 5. Mood Analytics Dashboard
- Built with Chart.js for visualization.
- Shows emotional patterns and historical mood trends.

### 🔗 6. LifeLong Code System
- User gets a unique **12-digit LifeLong Code**.
- This code can be shared with a trusted person.
- That person becomes the “LifeLine” of the user.

### ❤️ 7. LifeLine Notifications
- If the user's mood goes low (Sad, Neutral, Fear etc.),
  the LifeLine receives:
  - The user’s mood status  
  - Time of detection  
  - Suggested supportive actions

---

# 🛠 Tech Stack

### **Frontend**
- Next.js  
- shadcn/ui  
- Chart.js  
- Webcam API  

### **Backend**
- Next.js 
- Gemini API (AI conversational engine)  
- Spotify API  
- Quotify API  
- Face Expression Model  

### **Database**
- MongoDB  

---

# ⚙️ Core Functional Flow

### 1. Mood Detection  
User → Webcam → Emotion Model → UI updates mood.

### 2. Content Generation  
Based on mood:  
- Spotify for songs  
- Quotify for quotes  
- Gemini for AI conversation  
- Chart.js for analytics  

### 3. LifeLine System  
- User generates a 12-digit LifeLong Code  
- Someone enters the code → becomes LifeLine  
- LifeLine gets notified on low-mood events  

---

# 📁 Project Structure

moodboard/
├── public/
│   ├── models/
│   ├── a.jpg
│   ├── b.png
│   ├── p1.png
│   └── p2.png
├── src/
│   ├── app/
│   │   ├── analyseMood/
│   │   ├── api/
│   │   │   ├── addDetectedMood/
│   │   │   ├── addLifeLineCode/
│   │   │   ├── addLifeLongCode/
│   │   │   ├── avatarResp/
│   │   │   ├── chat/
│   │   │   ├── checkLifeLongCodeInThisID/
│   │   │   ├── checkLifeLongCodeInWhole/
│   │   │   ├── checkUser/
│   │   │   ├── connectionMsg/
│   │   │   ├── getConnections/
│   │   │   ├── getMood/
│   │   │   ├── quotes/
│   │   │   └── spotify/
│   │   ├── Components/
│   │   ├── interact/
│   │   ├── model/
│   │   ├── quotes/
│   │   ├── song/
│   │   └── utils/
│   ├── components/
│   │   └── ui/
│   └── lib/
└── README.md

---

# 🔐 LifeLong Code & LifeLine Logic

### LifeLong Code
- A unique 12-digit alphanumeric code generated for each user.  
- Permanently linked to their identity unless reset.

### LifeLine Binding
1. User A generates the code  
2. User B enters the code  
3. User B becomes the LifeLine for User A  

### Low-Mood Alerts
- If User A's mood = Sad / Neutral / Fear  
  → System notifies User B with mood status + suggestions.

---

# 🧠 AI Logic (Gemini)

### AI Chat Loop
Gemini → user → Gemini → user ...

AI provides:  
- Emotion-aware responses  
- Supportive communication  
- Contextual memory (within session)  
- Wellness-oriented suggestions  

---

# 🌤 Mood Categories

- Happy  
- Neutral  
- Sad  
- Fear  
- Angry  
- Surprised  
- Disgust (optional)  

Each mood triggers different features and recommendations.

---

# 📦 Installation & Setup

### 1. Clone the repository
```sh
git clone https://github.com/TamannaParashar/MoodBoard.git
```
### 2. Install dependencies
```sh
npm install
npm run dev
```
### 3. Setup environment variables
```sh
MONGO_URL=your_mongo_url
CLIENT_ID=xxxx
CLIENT_SECRET=xxxx
GEMINI_API_KEY=xxxx
```

# 📌 Future Enhancements

 - Voice-based mood detection
 - Therapy rooms
 - Advanced community support system
 - Daily journal system