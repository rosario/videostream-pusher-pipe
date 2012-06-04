(function() {
  var Player;

  document.addEventListener('DOMContentLoaded', function() {
    return new Player();
  }, false);

  Player = (function() {

    function Player() {
      var _this = this;
      this.img = document.querySelector('#screenshot');
      Pusher.host = "ws.darling.pusher.com";
      Pusher.log = function(message) {
        if (window.console && window.console.log) {
          return window.console.log(message);
        }
      };
      this.pusher = new Pusher('69d2536300b12f458390');
      this.mirror = this.pusher.subscribe('mirror');
      this.mirror.bind('frame', function(data) {
        return _this.img.src = data.dataUrl;
      });
    }

    return Player;

  })();

}).call(this);
