const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http');
const https = require('https');
const path = require('path');
const socketIO = require('socket.io');

// Certificate
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/twilio.councilbox.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/twilio.councilbox.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/twilio.councilbox.com/chain.pem', 'utf8');

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };

const Twilio = require('twilio');
const AccessToken = Twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'build')));

// Starting both http & https servers
const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

// This creates our socket using the instance of the server
const io = socketIO(httpServer)

app.get('/token', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('New client connected')

  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('change-publish', (data) => {
    // once we get a 'publish-user' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log(`User ${data.state}: `, data.identity)
    io.sockets.emit('publish-changed', {identity: data.identity, state: data.state})
  });

  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})


app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

// app.listen(8081, () => console.log('token server running on 8081'));

httpServer.listen(8080, () => {
	console.log('HTTP Server running on port 8080');
});

// httpsServer.listen(4433, () => {
// 	console.log('HTTPS Server running on port 4433');
// });
