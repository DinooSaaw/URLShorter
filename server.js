const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define URL schema
const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
});

// Create URL model
const URL = mongoose.model('URL', urlSchema);

// Define API routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/api/shorten', async (req, res) => {
    const longUrl = req.query.url;
    const urlCode = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;
  
    // Check if URL already exists in database
    const existingURL = await URL.findOne({ longUrl });
    if (existingURL) {
      return res.json(existingURL);
    }
  
    // Create new URL
    const newURL = new URL({ urlCode, longUrl, shortUrl });
    await newURL.save();
  
    res.json(newURL);
    console.log(`New URL created at ${newURL.createdAt} For URL: ${newURL.longUrl} Shorten URL: ${newURL.shortUrl}`);
  });
  
  app.get('/:code', async (req, res) => {
    const url = await URL.findOne({ urlCode: req.params.code });
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ error: 'URL not found' });
    }
  });
  