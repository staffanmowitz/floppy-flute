import {expData} from '../p5/sketch'

export default class extends Phaser.State {

  init () {

  }
  preload () {
    game.load.image('pipe', 'assets/images/pipe.png');
    game.load.image('bird', 'assets/images/bird.png');
    game.load.image('background', 'assets/images/background.png');

  }
  create () {
    console.log(expData());
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
