# Express.js. Serving /stream and /mirror
express = require('express')
app = express.createServer(express.logger())

app.set('view engine', 'jade');
app.use('/js', express.static(__dirname + '/js'));

port = 9000 || process.env.PORT || 3000;
app.listen port, ->
  console.log("Listening on " + port);

app.get '/stream', (req, res) -> 
  res.render('stream');

app.get '/mirror', (req, res) -> 
  res.render('mirror');


# Pusher Pipe. Streaming data over WebSockets
Pipe = require('pusher-pipe')
client = Pipe.createClient {
  key: 'your key'
  secret: 'your secret'
  app_id: 'your app id'
  debug: true
}

client.subscribe ['socket_message']
client.channel('stream').on 'event:frame', (socketId, data) ->
  client.channel('mirror').trigger 'frame', {message: 'Sending frame', dataUrl: data.dataUrl}

client.connect()
