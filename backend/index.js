const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const URL = require('./models/url');

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(
    () => console.log("MongoDB Connected")
);

// Enable CORS for all origins (for development)
app.use(cors());

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/url", urlRoute);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Serve React app for all non-API routes (except shortId redirects)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
        shortId
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );

    if (!entry) {
        return res.status(404).send('Short URL not found');
    }

    res.redirect(entry.redirectURL);
}); 

app.listen(PORT, () => console.log(`Server Started at Port ${PORT}`));