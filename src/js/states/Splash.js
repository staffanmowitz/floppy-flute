import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    
  }

  create () {
    this.state.start('Start')
  }
}
