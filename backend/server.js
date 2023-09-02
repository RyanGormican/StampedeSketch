const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors());

let currentPort = 3000; // Starting port number
const portCodeMap = {};

app.post('/generate-port', (req, res) => {
  const code = Math.random().toString(36).substring(2, 8);
  portCodeMap[currentPort] = code;
  res.json({ code, port: currentPort });
  currentPort++;
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
