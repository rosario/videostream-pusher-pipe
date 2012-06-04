(function() {
  var VideoStream,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  document.addEventListener('DOMContentLoaded', function() {
    return new VideoStream();
  }, false);

  VideoStream = (function() {

    function VideoStream() {
      this.snapshot = __bind(this.snapshot, this);
      this.stopRefresh = __bind(this.stopRefresh, this);
      this.refresh = __bind(this.refresh, this);      this.video = document.querySelector('video');
      this.video.addEventListener('click', this.snapshot, false);
      this.button = document.querySelector('#start');
      this.button.addEventListener('click', this.snapshot, false);
      this.stop = document.querySelector('#stop');
      this.stop.addEventListener('click', this.stopRefresh, false);
      this.canvas = document.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.getUserMedia();
      Pusher.host = "ws.darling.pusher.com";
      Pusher.log = function(message) {
        if (window.console && window.console.log) {
          return window.console.log(message);
        }
      };
      this.pusher = new Pusher('69d2536300b12f458390');
      this.pusher.back_channel.bind('ricevuto', function(data) {
        return console.log(data);
      });
      this.channel = this.pusher.subscribe('stream');
    }

    VideoStream.prototype.sizeCanvas = function() {
      var _this = this;
      return setTimeout(function() {
        _this.canvas.width = _this.video.videoWidth;
        return _this.canvas.height = _this.video.videoHeight;
      }, 50);
    };

    VideoStream.prototype.refresh = function() {
      var dataUrl;
      this.ctx.drawImage(this.video, 0, 0);
      dataUrl = this.canvas.toDataURL('image/webp');
      return this.channel.trigger('frame', {
        dataUrl: dataUrl
      });
    };

    VideoStream.prototype.stopRefresh = function() {
      console.log('stop timer');
      return clearTimeout(this.timer);
    };

    VideoStream.prototype.snapshot = function() {
      return this.timer = setInterval(this.refresh, 250);
    };

    VideoStream.prototype.getUserMedia = function() {
      var version,
        _this = this;
      version = parseInt(window.navigator.appVersion.match(/Chrome\/(.*?) /)[1].split('.')[0]);
      if (navigator.webkitGetUserMedia) {
        if (version < 21) {
          return navigator.webkitGetUserMedia('video', function(stream) {
            _this.video.src = window.webkitURL.createObjectURL(stream);
            _this.sizeCanvas();
            return _this.button.textContent = 'Take Shot';
          }, this.onFailSoHard);
        } else {
          return navigator.webkitGetUserMedia({
            video: true
          }, function(stream) {
            _this.video.src = window.webkitURL.createObjectURL(stream);
            _this.sizeCanvas();
            return _this.button.textContent = 'Take Shot';
          }, this.onFailSoHard);
        }
      } else {
        return console.log('Error with getUserMedia()');
      }
    };

    return VideoStream;

  })();

}).call(this);
