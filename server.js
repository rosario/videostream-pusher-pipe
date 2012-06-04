(function() {
  var Pipe, app, client, express, port;

  express = require('express');

  app = express.createServer(express.logger());

  app.set('view engine', 'jade');

  app.use('/js', express.static(__dirname + '/js'));

  port = 9000 || process.env.PORT || 3000;

  app.listen(port, function() {
    return console.log("Listening on " + port);
  });

  app.get('/stream', function(req, res) {
    return res.render('stream');
  });

  app.get('/mirror', function(req, res) {
    return res.render('mirror');
  });

  Pipe = require('pusher-pipe');

  client = Pipe.createClient({
    key: '69d2536300b12f458390',
    secret: '361e1e27c6e319420f4d',
    app_id: '89',
    debug: true
  });

  client.subscribe(['socket_message']);

  client.channel('stream').on('event:frame', function(socketId, data) {
    return client.channel('mirror').trigger('frame', {
      message: 'Sending frame',
      dataUrl: data.dataUrl
    });
  });

  client.connect();

}).call(this);
