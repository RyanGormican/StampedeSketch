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

const rounds = [
  { mode: 'idea', duration: 15 },
  { mode: 'create', duration: 60 },
  { mode: 'vote', duration: 15 },
  { mode: 'idea', duration: 15 },
  { mode: 'create', duration: 60 },
  { mode: 'vote', duration: 15 },
  { mode: 'idea', duration: 15 },
  { mode: 'create', duration: 60 },
  { mode: 'vote', duration: 15 },
  { mode: 'idea', duration: 15 },
  { mode: 'create', duration: 60 },
  { mode: 'vote', duration: 15 },
  { mode: 'idea', duration: 15 },
  { mode: 'create', duration: 60 },
  { mode: 'vote', duration: 15 },
];

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
  const port = parseInt(req.params.port);

  if (activePorts.has(port)) {
    const portData = activePorts.get(port);
    portData[0].state = 'game';
     portData[0].rounds = 15; 
      portData[0].currentround = 1; 
      portData[0].mode='idea';
      portData[0].roundTimeLeft=15;
    res.json({ message: 'Game started', state: 'game' });

    const gameTimer = setInterval(() => {
      if (portData[0].state === 'game' && portData[0].currentround <= 15) {
        portData[0].roundTimeLeft--;
        if (portData[0].roundTimeLeft === 0) {
  
          portData[0].currentround++;
          if (portData[0].currentround <= 15) {
            portData[0].mode = rounds[portData[0].currentround - 1].mode;
            portData[0].roundTimeLeft = rounds[portData[0].currentround - 1].duration;
            io.emit(`round-started-${port}`, { mode: portData[0].mode, time: portData[0].roundTimeLeft });
          } else {
            portData[0].state = 'Results';
            io.emit(`game-finished-${port}`);
            clearInterval(gameTimer);
          }
        }
      }
    }, 1000);
  } else {
    res.status(404).json({ error: 'Port not found' });
  }
});
app.get('/check-round/:port', (req, res) => {
  const port = parseInt(req.params.port);

  if (activePorts.has(port)) {
    const portData = activePorts.get(port);
    if (portData[0].state === 'game') {
      const currentRound = Math.ceil(portData[0].currentround / 3); 
      const currentMode = portData[0].mode;
      const roundTimeLeft = portData[0].roundTimeLeft;
      res.json({ round: currentRound, mode: currentMode, time: roundTimeLeft });
    } else {
      res.json({ round: null, mode: null, time: null });
    }
  } else {
    res.status(404).json({ error: 'Port not found' });
  }
});


app.get('/check-game-state/:port', (req, res) => {
  const port = parseInt(req.params.port);

  if (activePorts.has(port)) {
    const portData = activePorts.get(port);
    if (portData[0].state === 'game') {
      res.json({ state: 'game' });
    } else {
      res.json({ state: 'waiting' });
    }
  } else {
    res.status(404).json({ error: 'Port not found' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
