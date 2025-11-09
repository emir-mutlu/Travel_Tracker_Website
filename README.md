🧭 Travel Tracker – Explore Your World, Visually
🌍 Overview

Travel Tracker is a full-stack web application that lets you visualize all the countries you (or your friends) have visited — all highlighted on an interactive world map.
Built with Node.js, Express, EJS, PostgreSQL, and CSS3 animations, it blends a minimalist UI with vibrant gradients and real-time updates.

“Track your travels. Watch your map light up.”

✨ Features

👤 Multi-Profile support — create separate travel profiles for each person

🗺️ Interactive map — countries are highlighted dynamically when added

🎨 Color-coded profiles — each traveler has a unique color on the map

💾 Persistent storage — all data stored in PostgreSQL

⚡ Animated gradient background with a modern UI design


| Layer               | Technology                                          |
| ------------------- | --------------------------------------------------- |
| **Frontend**        | HTML5, EJS, CSS3 (Bootstrap-inspired custom design) |
| **Backend**         | Node.js (Express.js)                                |
| **Database**        | PostgreSQL                                          |
| **Templating**      | EJS                                                 |
| **Styling**         | Custom CSS + subtle gradient animation              |
| **Version Control** | Git & GitHub                                        |


📦 travel-tracker
 ┣ 📂 public/
 ┃ ┣ 📂 styles/
 ┃ ┃ ┣ main.css
 ┃ ┃ ┗ new.css
 ┣ 📂 views/
 ┃ ┣ index.ejs
 ┃ ┗ new.ejs
 ┣ 📄 index.js
 ┣ 📄 queries.sql
 ┗ 📄 package.json


⚙️ Installation & Setup
1. Clone this repository
git clone https://github.com/yourusername/travel-tracker.git
cd travel-tracker


2. Install dependencies
npm install

3. Setup PostgreSQL database

4. Configure database connection

Edit your index.js:

5. Run the server
node index.js
http://localhost:3000


### 🏠 Home Page
![Home Page](public/screenshots/home.png)

### 👤 Add Profile
![Add Profile Page](public/screenshots/add-profile.png)




