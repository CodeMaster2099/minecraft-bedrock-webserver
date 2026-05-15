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
app.get("/dashboard", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Minecraft Control Panel</title>
        <style>
          body { font-family: Arial; background: #111; color: #fff; text-align: center; }
          button { padding: 15px 30px; margin: 10px; font-size: 18px; border-radius: 8px; cursor: pointer; }
          .start { background: #28a745; color: white; }
          .stop { background: #dc3545; color: white; }
          .status { margin-top: 20px; font-size: 22px; }
        </style>
      </head>
      <body>
        <h1>Minecraft Bedrock Panel</h1>

        <button class="start" onclick="fetch('/start').then(r=>r.text()).then(alert)">Start Server</button>
        <button class="stop" onclick="fetch('/stop').then(r=>r.text()).then(alert)">Stop Server</button>

        <div class="status" id="statusBox">Checking status...</div>

        <script>
          async function updateStatus() {
            try {
              const res = await fetch('/status');
              const data = await res.json();
              document.getElementById('statusBox').innerHTML =
                data.running ? '🟢 Server is RUNNING' : '🔴 Server is OFFLINE';
            } catch {
              document.getElementById('statusBox').innerHTML = '⚠️ Cannot reach server';
            }
          }
          updateStatus();
          setInterval(updateStatus, 5000);
        </script>
      </body>
    </html>
  `);
});
