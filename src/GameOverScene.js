import Phaser from "phaser";

class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }
  preload() {
    this.load.image("closure", "assets/closure.png");
  }

  create() {
    this.add.image(400, 300, "closure");

    this.input.keyboard.once("keydown", () => {
      this.scene.start("PreloadScene");
    });
  }
}
export default GameOverScene;
