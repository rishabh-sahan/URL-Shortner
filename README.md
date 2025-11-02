# ✨ URL Shortener

A modern, full-stack URL shortening application with a beautiful gradient UI and powerful analytics. Transform long URLs into short, shareable links and track their usage with detailed analytics.

![URL Shortener](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## 🎯 Features

- **URL Shortening**: Convert long URLs into compact, shareable short links
- **Analytics Dashboard**: Track clicks and view detailed visit history for each shortened URL
- **Recent URLs History**: View your 10 most recently created short URLs
- **Beautiful UI**: Modern, gradient-based design with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Real-time Updates**: Instant feedback on all operations
- **MongoDB Storage**: Reliable data persistence

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **Shortid** - Unique ID generation

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **CSS3** - Styling with gradients and animations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v5.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd url-shortener
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

## 🎮 Usage

### Development Mode

1. **Start the Backend Server**

```bash
npm start
# or
npm run dev
```

The backend server will start on `http://localhost:8001`

2. **Start the Frontend Development Server**

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Production Build

1. **Build the Frontend**

```bash
cd frontend
npm run build
cd ..
```

2. **Start the Production Server**

```bash
npm start
```

The application will serve the built frontend from the backend at `http://localhost:8001`

## 📡 API Documentation

### Base URL
```
http://localhost:8001
```

### Endpoints

#### 1. Create Short URL

**Endpoint:** `POST /url`

**Request Body:**
```json
{
  "url": "https://example.com/very-long-url"
}
```

**Response:**
```json
{
  "id": "aBc123XyZ"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid URL or missing URL parameter

---

#### 2. Get Analytics

**Endpoint:** `GET /url/analytics/:shortId`

**Parameters:**
- `shortId` - The short ID of the URL

**Response:**
```json
{
  "totalClicks": 5,
  "analytics": [
    {
      "timestamp": 1698765432000
    },
    {
      "timestamp": 1698769032000
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `404` - Short URL not found

---

#### 3. Redirect to Original URL

**Endpoint:** `GET /:shortId`

**Parameters:**
- `shortId` - The short ID of the URL

**Behavior:**
- Redirects to the original long URL
- Increments the visit count
- Records timestamp of visit

**Status Codes:**
- `302` - Redirect
- `404` - Short URL not found

## 💻 Project Structure

```
url-shortener/
├── backend/
│   ├── connect.js           # MongoDB connection
│   ├── controllers/
│   │   └── url.js           # URL controllers
│   ├── models/
│   │   └── url.js           # URL schema
│   ├── routes/
│   │   └── url.js           # API routes
│   ├── index.js             # Main server file
│   └── package.json         # Backend dependencies
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── App.css          # Styles
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies
├── package.json             # Root dependencies
└── README.md
```

## 🎨 Features in Detail

### URL Shortening
- Enter any valid HTTP/HTTPS URL
- Instantly generates a unique short ID
- Displays the shortened URL with copy functionality
- Validates URLs before processing

### Analytics Dashboard
- Enter a short ID to view analytics
- See total clicks count
- View complete visit history with timestamps
- Real-time data updates

### Recent URLs
- Automatically saves your last 10 shortened URLs
- Persists data in browser localStorage
- Click any URL to copy to clipboard
- Quick access to view analytics for any recent URL

### User Experience
- Smooth animations powered by Framer Motion
- Toast notifications for user actions
- Alert messages for errors and success states
- Responsive design for all screen sizes
- Beautiful gradient backgrounds with animated orbs

## 🔧 Configuration

### Backend Configuration

Edit `backend/index.js` to modify:

```javascript
const PORT = 8001;  // Change server port
const mongoURL = "mongodb://localhost:27017/short-url";  // Change database URL
```

### Frontend Configuration

Edit `frontend/src/App.jsx` to modify:

```javascript
const API_BASE = 'http://localhost:8001';  // Change API base URL
```

## 📦 Database Schema

### URL Collection

```javascript
{
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  redirectURL: {
    type: String,
    required: true
  },
  visitHistory: [
    {
      timestamp: { type: Number }
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### Common Issues

**Issue:** Backend server won't start
- **Solution:** Ensure MongoDB is running and accessible
- Check if port 8001 is available

**Issue:** Frontend can't connect to backend
- **Solution:** Verify CORS is enabled in backend
- Check if backend server is running on port 8001

**Issue:** MongoDB connection error
- **Solution:** Ensure MongoDB service is running
- Verify MongoDB connection string in `backend/connect.js`

**Issue:** Short URLs not redirecting
- **Solution:** Check if the short ID exists in database
- Verify the URL schema has correct data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Rishabh Jain H**

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) for the backend framework
- [React](https://react.dev/) for the UI library
- [MongoDB](https://www.mongodb.com/) for the database
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Vite](https://vitejs.dev/) for blazing fast development

## 📸 Screenshots

### Main Interface
The main URL shortening interface with gradient background and smooth animations.

### Analytics Dashboard
Detailed analytics showing click counts and visit history.

### Recent URLs
Quick access to your recently shortened URLs with one-click copying.

---

**Built with ❤️ using Node.js, React, and MongoDB**