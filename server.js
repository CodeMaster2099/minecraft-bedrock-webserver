const express = require("express");
const axios = require("axios");
const multer = require("multer");

const LOCAL_AGENT = "https://ignore-zap-scaling.ngrok-free.dev"; // <-- replace with your real ngrok URL

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Upload add-ons (still allowed)
const upload = multer({ dest: "bedrock/behavior_packs/" });

// Forward START to local agent
app.get("/start", async (req, res) => {
  try {
    const r = await axios.post(`${LOCAL_AGENT}/start`);
    res.send(r.data);
  } catch (err) {
    res.status(500).send("Failed to contact local agent");
  }
});

// Forward STOP to local agent
app.get("/stop", async (req, res) => {
  try {
    const r = await axios.post(`${LOCAL_AGENT}/stop`);
    res.send(r.data);
  } catch (err) {
    res.status(500).send("Failed to contact local agent");
  }
});

// Forward STATUS to local agent
app.get("/status", async (req, res) => {
  try {
    const r = await axios.get(`${LOCAL_AGENT}/status`);
    res.json(r.data);
  } catch (err) {
    res.status(500).send("Failed to contact local agent");
  }
});

// Upload add-on (unchanged)
app.post("/upload-addon", upload.single("addon"), (req, res) => {
  res.send("Add-on uploaded");
});

app.listen(3000, () => {
  console.log("Web API running on port 3000");
});
