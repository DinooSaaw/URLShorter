const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const dotenv = require("dotenv");
const crypto = require("crypto");

const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

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

const authSchema = new mongoose.Schema({
  clientId: String,
  token: String,
  privilegeLevel: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Create URL model
const URL = mongoose.model("URL", urlSchema);
const AUTH = mongoose.model("AUTH", authSchema);

// // Define API routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/api/shorten", async (req, res) => {
  try {
    const longUrl = req.query.url;
    const urlCode = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}${urlCode}`;

    // Check if URL already exists in database
    const existingURL = await URL.findOne({ longUrl });
    if (existingURL) {
      return res.json(existingURL);
    }

    // Create new URL
    const newURL = new URL({ urlCode, longUrl, shortUrl });
    await newURL.save();

    res.status(201).json(newURL);
    console.log(
      `New URL created at ${newURL.createdAt} Shorten URL: ${newURL.shortUrl}`
    );
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/auth", async (req, res) => {
  try {
    const ClientId = req.query.clientId;

    if (!ClientId) {
      return res.status(400).json({ error: "Missing ClientId" });
    } else {
      const auth = await AUTH.findOne({ clientId: ClientId });
      console.log(auth)
      if (auth) {
        return res.json(auth);
      }
      if (!auth) {
        const token = generateRandomString(16);

        const newAuth = await AUTH({ clientId: ClientId, token: `Bearer ` + token });
        newAuth.save();
        console.log(`New Authentication created at ${newAuth.createdAt} Token: ${newAuth.token}`);
        return res.status(201).json(newAuth);
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/:code", async (req, res) => {
  const url = await URL.findOne({ urlCode: req.params.code });
  if (url) {
    return res.redirect(url.longUrl);
  } else {
    return res.status(404).json({ error: "URL not found" });
  }
});

app.delete("/:code", async (req, res) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader)
  if (!authHeader) {
    return res.status(401).json({ error: "Invalid Auth Token" });
  }
  const auth = await AUTH.findOne({ token: authHeader });
  if (!auth) {
    return res.status(401).json({ error: "Invalid Auth Token" });
  }
  if (auth.privilegeLevel < 1 || auth.active == false) {
    return res.status(401).json({ error: "Missing Privileges" });
  }
  const url = await URL.findOne({ urlCode: req.params.code });
  if (!url) {
    return res.status(404).json({ error: "URL not found" });
  }
  await URL.deleteOne({ urlCode: req.params.code });
  console.log(`Deleted: ${url.longUrl} || ${url.shortUrl}`);
  return res.json();
});

app.get("/", async (req, res) => {
  let urls = await URL.find()
  res.send(urls);
})