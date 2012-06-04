document.addEventListener('DOMContentLoaded', ->
  new Player();
, false);

class Player
  constructor: ->
    @img = document.querySelector('#screenshot')
    Pusher.host = "ws.darling.pusher.com"
    Pusher.log = (message) ->
      if (window.console && window.console.log) 
        window.console.log(message)

    @pusher = new Pusher('YOURKEY')
    
    @mirror = @pusher.subscribe 'mirror'
    @mirror.bind 'frame', (data) =>
      @img.src = data.dataUrl;
      