const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors());
const activePorts = new Map();
let currentPort = 4000; 
const portCodeMap = {};

app.post('/generate-port', (req, res) => {
  const code = Math.random().toString(36).substring(2, 8);
  portCodeMap[currentPort] = code;
  const userToken = req.body.userToken;
  activePorts.set(currentPort, []);
  activePorts.get(currentPort).push(userToken);
  res.json({ code, port: currentPort });
  currentPort++; //
});

app.get('/active-ports', (req, res) => {
  const activePortsArray = Array.from(activePorts.keys());
  const data = activePortsArray.map((port) => ({
    port,
    users: activePorts.get(port),
  }));
  res.json(data);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
