export default class extends Phaser.State {
  init () {}

  preload () {
    this.load.image('background', './assets/images/background.png')
  }
  create () {
    this.background = game.add.sprite(0, 0, 'background')
    let gameHeader = game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'Floppy Flute', {align: "center", font: "100px Arial", fill: '#ffffff'})
    gameHeader.anchor.setTo(0.5, 0.5)
    let style = {align: "center", font: "50px Arial", fill: '#ffffff'}
    let menu = []
    let menuItem1 = game.add.text(this.game.world.centerX, this.game.world.centerY + 50, 'Play', style)
    let menuItem2 = game.add.text(this.game.world.centerX, this.game.world.centerY + 150, 'Options', style)
    menu.push(menuItem1, menuItem2)
    menu.forEach(function(menuItem){
      menuItem.anchor.setTo(0.5, 0.5)
      menuItem.inputEnabled = true
      menuItem.events.onInputOver.add(hover, this);menuItem.events.onInputOut.add(out, this);
    });
    menuItem1.events.onInputDown.add(startGame, this);


    function startGame() {
      this.state.start('Game')
    }
    function hover(menuItem) {
      menuItem.addColor('#f4f142', 0)
    }
    function out(menuItem) {
      menuItem.addColor('#ffffff', 0)
    }
  }
  render () {
    game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.state.start('Game')
  }
}
