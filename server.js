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
        <title>Minecraft Hosting Panel</title>
        <style>
          body {
            margin: 0;
            background: #0d1117;
            color: #e6edf3;
            font-family: Arial, sans-serif;
          }
          .navbar {
            background: #161b22;
            padding: 15px 25px;
            font-size: 22px;
            font-weight: bold;
            border-bottom: 1px solid #30363d;
          }
          .container {
            padding: 30px;
            max-width: 900px;
            margin: auto;
          }
          .card {
            background: #161b22;
            padding: 25px;
            border-radius: 12px;
            border: 1px solid #30363d;
            margin-bottom: 25px;
          }
          .title {
            font-size: 26px;
            margin-bottom: 10px;
          }
          .status-online {
            color: #3fb950;
            font-weight: bold;
          }
          .status-offline {
            color: #f85149;
            font-weight: bold;
          }
          .btn {
            padding: 15px 25px;
            font-size: 18px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            margin-right: 10px;
          }
          .start-btn {
            background: #238636;
            color: white;
          }
          .stop-btn {
            background: #da3633;
            color: white;
          }
          .refresh {
            margin-top: 10px;
            font-size: 14px;
            opacity: 0.7;
          }
        </style>
      </head>

      <body>
        <div class="navbar">Minecraft Hosting Panel</div>

        <div class="container">

          <div class="card">
            <div class="title">Server Status</div>
            <div id="statusText">Checking...</div>
            <div class="refresh">Auto-refreshing every 5 seconds</div>
          </div>

          <div class="card">
            <div class="title">Controls</div>
            <button class="btn start-btn" onclick="startServer()">Start Server</button>
            <button class="btn stop-btn" onclick="stopServer()">Stop Server</button>
          </div>

        </div>

        <script>
          async function updateStatus() {
            try {
              const res = await fetch('/status');
              const data = await res.json();
              document.getElementById('statusText').innerHTML =
                data.running
                  ? '<span class="status-online">🟢 ONLINE</span>'
                  : '<span class="status-offline">🔴 OFFLINE</span>';
            } catch {
              document.getElementById('statusText').innerHTML =
                '<span class="status-offline">⚠️ Cannot reach server</span>';
            }
          }

          async function startServer() {
            alert(await (await fetch('/start')).text());
            updateStatus();
          }

          async function stopServer() {
            alert(await (await fetch('/stop')).text());
            updateStatus();
          }

          updateStatus();
          setInterval(updateStatus, 5000);
        </script>
      </body>
    </html>
  `);
});
