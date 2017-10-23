export default class extends Phaser.State {
  init () {

  }
  preload () {
    game.load.image('pipe', 'assets/images/pipe.png');
    game.load.image('bird', 'assets/images/bird.png');
    game.load.image('background', 'assets/images/background.png');

  }
  create () {
    var webaudio_tooling_obj = function () {
      var audioContext = new AudioContext();

      console.log("audio is starting up ...");

      var BUFF_SIZE = 16384;

      var audioInput = null,
          microphone_stream = null,
          gain_node = null,
          script_processor_node = null,
          script_processor_fft_node = null,
          analyserNode = null;

      if (!navigator.getUserMedia)
              navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || navigator.msGetUserMedia;

      if (navigator.getUserMedia){

          navigator.getUserMedia({audio:true},
            function(stream) {
                start_microphone(stream);
            },
            function(e) {
              alert('Error capturing audio.');
            }
          );

      } else { alert('getUserMedia not supported in this browser.'); }

      // ---

      function show_some_data(given_typed_array, num_row_to_display, label, self) {
          var size_buffer = given_typed_array.length;
          var index = 0;
          var max_index = num_row_to_display;

          for (; index < max_index && index < size_buffer; index += 1) {
              console.log(given_typed_array[index])
          }
      }

      function process_microphone_buffer(event) {

          var i, N, inp, microphone_output_buffer;

          microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now

          // microphone_output_buffer  <-- this buffer contains current gulp of data size BUFF_SIZE

          show_some_data(microphone_output_buffer, 5, "from getChannelData");
      }

      function start_microphone(stream){

        gain_node = audioContext.createGain();
        gain_node.connect( audioContext.destination );

        microphone_stream = audioContext.createMediaStreamSource(stream);
        microphone_stream.connect(gain_node);

        script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        script_processor_node.onaudioprocess = process_microphone_buffer;

        microphone_stream.connect(script_processor_node);

        // --- setup FFT

        script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
        script_processor_fft_node.connect(gain_node);

        analyserNode = audioContext.createAnalyser();
        analyserNode.smoothingTimeConstant = 0;
        analyserNode.fftSize = 2048;

        microphone_stream.connect(analyserNode);

        analyserNode.connect(script_processor_fft_node);

        script_processor_fft_node.onaudioprocess = function() {

          // get the average for the first channel
          var array = new Uint8Array(analyserNode.frequencyBinCount);
          analyserNode.getByteFrequencyData(array);

          // draw the spectrogram
          if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {

              show_some_data(array, 5, "from fft");
          }
        };
      }

    }(); //  webaudio_tooling_obj = function()
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.background = game.add.tileSprite(0, 0, game.width, game.height, 'background')
    this.bird = game.add.sprite(100, 245, 'bird');
    this.bird.anchor.setTo(-0.2, 0.5);
    this.bird.gravity = 0
    this.pipes = game.add.group();
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0",{ font: "30px Arial", fill: "#ffffff" });
    game.physics.arcade.enable(this.bird);
    this.timer = game.time.events.loop(3000, this.addRowOfPipes, this);
	  this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(this.jump, this);
  }
  update(){
    this.score += 1;
    this.labelScore.text = this.score;
    game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);
    if (this.bird.angle < 20)
    this.bird.angle += 1;
  }
  render () {

  }
  jump() {
      if (this.bird.alive == false)
        return;
      var animation = game.add.tween(this.bird);
      animation.to({angle: -20}, 100);
      animation.start();
      this.goUp(this.level)
  }
  restartGame() {
      game.state.start('Game');
      game.physics.arcade.overlap(
      this.bird, this.pipes, this.restartGame, null, this);
  }
  addOnePipe(x, y) {
      var pipe = game.add.sprite(x, y, 'pipe');
      this.pipes.add(pipe);
      game.physics.arcade.enable(pipe);
      pipe.body.velocity.x = -200;
      pipe.checkWorldBounds = true;
      pipe.outOfBoundsKill = true;
  }
  addRowOfPipes () {
    var hole = Math.floor(Math.random() * 5) + 1;
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1)
            this.addOnePipe(window.innerWidth, i * 120 + 10);
    }
    hitPipe () {
      if (this.bird.alive == false) {
          return;
      }
      this.bird.alive = false;
      game.time.events.remove(this.timer);
      this.pipes.forEach(function(p){
          p.body.velocity.x = 0;
      }, this);
      game.paused = true
    }
    goUp (velocity) {
      if (velocity ) {
        this.bird.position.y += velocity
      }
      console.log(this.bird.position.y);
    }
}
