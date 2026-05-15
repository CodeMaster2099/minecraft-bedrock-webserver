const express = require("express");
const { spawn } = require("child_process");

const app = express();
app.use(express.json());

let bedrockProcess = null;

app.post("/start", (req, res) => {
  if (bedrockProcess) return res.send("Already running");

  bedrockProcess = spawn("./bedrock_server.exe", [], {
    cwd: "C:/Users/engra/minecraft-bedrock"
  });

  bedrockProcess.stdout.on("data", d => console.log(d.toString()));
  bedrockProcess.stderr.on("data", d => console.error(d.toString()));

  bedrockProcess.on("close", () => bedrockProcess = null);

  res.send("Started");
});

app.post("/stop", (req, res) => {
  if (!bedrockProcess) return res.send("Not running");

  bedrockProcess.stdin.write("stop\n");
  res.send("Stopping");
});

app.get("/status", (req, res) => {
  res.json({ running: !!bedrockProcess });
});

app.listen(5000, () => console.log("Local agent running on port 5000"));
