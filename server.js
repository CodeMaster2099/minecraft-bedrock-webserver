app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const express = require("express");
const { spawn } = require("child_process");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload add-ons
const upload = multer({ dest: "bedrock/behavior_packs/" });

// Start Bedrock server
let bedrockProcess = null;

app.get("/start", (req, res) => {
    if (bedrockProcess) return res.send("Server already running");

    bedrockProcess = spawn("./bedrock_server", [], {
        cwd: "./bedrock"
    });

    bedrockProcess.stdout.on("data", data => {
        console.log(data.toString());
    });

    bedrockProcess.stderr.on("data", data => {
        console.error(data.toString());
    });

    bedrockProcess.on("close", () => {
        bedrockProcess = null;
    });

    res.send("Bedrock server started");
});

// Stop Bedrock server
app.get("/stop", (req, res) => {
    if (!bedrockProcess) return res.send("Server not running");

    bedrockProcess.stdin.write("stop\n");
    res.send("Stopping server");
});

// Upload add-on
app.post("/upload-addon", upload.single("addon"), (req, res) => {
    res.send("Add-on uploaded");
});

app.listen(3000, () => console.log("Web API running on port 3000"));
