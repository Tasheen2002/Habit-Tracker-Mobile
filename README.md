# 📱 Habit Tracker – Build Good Habits, Break Bad Ones!

A mobile habit tracking app built with React Native CLI and TypeScript that empowers users to create daily or weekly habits, mark them as completed, and track their progress over time.

---

## 📽️ Demo Video

Watch the app in action:  
🎬 https://github.com/user-attachments/assets/bdc48d30-22bc-456d-89fb-c28bd35fb0b8




---

## 📦 APK Download

Download and install the latest release:  
📲 https://github.com/Tasheen2002/Habit-Tracker-Mobile/releases

---

## 🔗 GitHub Repository

Explore the full source code here:  
🛠️ https://github.com/Tasheen2002/Habit-Tracker-Mobile


---

## 🛠 Project Objective

Create a mobile app where users can:

- Register/Login (local storage only)
- Create daily/weekly habits
- Mark habits as completed
- Track progress over time
- Store and retrieve habit data with AsyncStorage

---

## ✨ Core Features

- 🔐 **Registration/Login** – Simple form using local AsyncStorage
- ➕ **Create Habits** – Name + frequency (Daily / Weekly)
- 📋 **Habit List** – View and mark as complete
- 📊 **Progress Tracking** – Daily and optional weekly stats
- 🚪 **Logout** – Clears storage and resets app

---

## 🌟 Bonus Features

- 📅 Calendar View for habit streaks
- 🌙 Light/Dark Mode
- 🎉 Animations for actions
- 🌐 Offline-first capability

---

## 📁 Folder Structure
HabitTracker/
├── src/
│ ├── components/
│ │ ├── common/ # Shared UI elements
│ │ ├── habits/ # Habit-specific UI components
│ │ └── calendar/ # Calendar view
│ ├── screens/
│ │ ├── auth/ # Login/Register
│ │ ├── habits/ # Habit-related screens
│ │ └── settings/ # Settings screen
│ ├── navigation/ # App navigation setup
│ ├── services/ # AsyncStorage & data logic
│ ├── context/ # App-wide state
│ ├── types/ # TypeScript types
│ ├── utils/ # Utilities
│ └── styles/ # Theme and style constants
├── App.tsx
├── package.json
└── README.md

---

## 🧰 Tech Stack

| Tool               | Purpose                          |
|--------------------|----------------------------------|
| React Native CLI   | App development framework        |
| TypeScript         | Strong typing                    |
| React Navigation   | Stack & Tab navigation           |
| AsyncStorage       | Local persistence of user data   |
| useContext         | State management (bonus)         |

---

## ⚙️ Setup Instructions

1. Clone the repository:
   git clone https://github.com/your-username/habit-tracker-app
   cd habit-tracker-app

2.	Install dependencies:
npm install
3.	Start Metro bundler:
npx react-native start
________________________________________
📱 Running the App
▶ Android
npx react-native run-android
Ensure an emulator or physical device is connected and USB debugging is enabled.
🍎 iOS (MacOS only)
npx pod-install
npx react-native run-ios

👨‍💻 Author
Name: Tasheen Darshika
Email: darshikatasheen99@gmail.com
