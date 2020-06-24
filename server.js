const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http');
const https = require('https');
const path = require('path');

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

app.post('/updateSubscription', async (req, res) => {
  const { identity, roomName } = req.body;

  const client = new Twilio(twilioApiKeySID, twilioApiKeySecret, {accountSid: twilioAccountSid});

  client.video.rooms(roomName).participants
  .each({status: 'connected'}, (participant) => {
    if(participant.identity == 'moderator') return;
    client.video.rooms(roomName).participants.get(participant.identity)
    .subscribeRules.update({
      rules: [
        {"type": "include", "all": true},
        {"type": "exclude", "publisher": identity}
      ]
    })
    .then(result => {
      res.send(result)
      console.log('Subscribe Rules updated successfully')
    })
    .catch(error => {
      res.send(error)
      console.log('Error updating rules ' + error)
    });
  });

});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

// app.listen(8081, () => console.log('token server running on 8081'));

// Starting both http & https servers
const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, () => {
	console.log('HTTP Server running on port 8080');
});

// httpsServer.listen(4433, () => {
// 	console.log('HTTPS Server running on port 4433');
// });
