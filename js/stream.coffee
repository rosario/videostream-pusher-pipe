document.addEventListener('DOMContentLoaded', ->
  new VideoStream();
, false);



class VideoStream
  constructor: ->
    
    
    @video = document.querySelector('video')
    @video.addEventListener('click', @snapshot, false)
    
    @button = document.querySelector('#start')
    @button.addEventListener('click', @snapshot, false)
    
    @stop = document.querySelector('#stop')
    @stop.addEventListener('click', @stopRefresh, false)
    
    @canvas = document.querySelector('canvas')
    @ctx = @canvas.getContext('2d')    
    @getUserMedia()
    
    
    Pusher.host = "ws.darling.pusher.com"
    Pusher.log = (message) ->
      if (window.console && window.console.log) 
        window.console.log(message)

    @pusher = new Pusher('YOURKEY')        
    @channel = @pusher.subscribe 'stream'

  sizeCanvas: ->
    setTimeout( =>
      @canvas.width = @video.videoWidth;
      @canvas.height = @video.videoHeight;
    , 50)
  
  refresh: =>
    @ctx.drawImage(@video, 0, 0)
    dataUrl = @canvas.toDataURL('image/webp')
    @channel.trigger 'frame',  dataUrl: dataUrl
      
  stopRefresh: =>
    console.log('stop timer')
    clearTimeout(@timer)
    
  snapshot: =>
    @timer = setInterval( @refresh, 250)  
    
  getUserMedia: ->
    version = parseInt(window.navigator.appVersion.match(/Chrome\/(.*?) /)[1].split('.')[0]);
    if navigator.webkitGetUserMedia
      if (version < 21)
          navigator.webkitGetUserMedia('video', (stream) =>
            @video.src = window.webkitURL.createObjectURL(stream);
            @sizeCanvas()
            @button.textContent = 'Take Shot'
          , @onFailSoHard)
      else 
          navigator.webkitGetUserMedia({video:true}, (stream) =>
            @video.src = window.webkitURL.createObjectURL(stream)
            @sizeCanvas()
            @button.textContent = 'Take Shot'
          , @onFailSoHard)
    else 
     console.log 'Error with getUserMedia()'
      