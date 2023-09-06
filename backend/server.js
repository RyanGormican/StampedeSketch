const express = require('express');
const app = express();
const cors = require('cors');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
app.use(express.json());

app.use(cors());
const activePorts = new Map();
let currentPort = 4000;
const portCodeMap = {};


const INACTIVE_THRESHOLD = 2000; 

function cleanupInactiveUsers() {
  activePorts.forEach((users, port) => {
    const currentTime = Date.now();
    const newUsers = users.filter((user) => {
      return currentTime - user.lastHeartbeat <= INACTIVE_THRESHOLD;
    });

    activePorts.set(port, newUsers);
  });
}


const cleanupInterval = setInterval(cleanupInactiveUsers, 1000); 

app.post('/generate-port', (req, res) => {
  const code = Math.random().toString(36).substring(2, 8);
  portCodeMap[currentPort] = code;
  const userToken = req.body.userToken;
  activePorts.set(currentPort, [{ userToken, lastHeartbeat: Date.now() }]);
  res.json({ code, port: currentPort });
  currentPort++;
});

app.post('/join-port', (req, res) => {
  const { userToken, joinCode } = req.body;
  const port = req.body.joinCode;

  if (activePorts.has(port)) {
    activePorts.get(port).push({ userToken, lastHeartbeat: Date.now(), state: 'waiting' });
    res.json({ port });
  } else {
    res.status(404).json({ error: 'Port not found' });
  }
});

app.get('/get-users/:port', (req, res) => {
  const port = parseInt(req.params.port);

  if (activePorts.has(port)) {
    const users = activePorts.get(port).map(user => user.userToken);
    res.json({ port, users });
  } else {
    res.status(404).json({ error: 'Port not found' });
  }
});

app.post('/heartbeat', (req, res) => {
  const { userToken } = req.body;

  activePorts.forEach((users) => {
    const user = users.find((user) => user.userToken === userToken);
    if (user) {
      user.lastHeartbeat = Date.now();
    }
  });

  res.status(200).send('Heartbeat received');
});
app.post('/start-game/:port', (req, res) => {
  
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
