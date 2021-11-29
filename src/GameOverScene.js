import Phaser from "phaser";

class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }
  preload() {
    this.load.image("sky", "assets/sky.png");
  }

  create() {
    this.game.scene.dump();
    this.add.image(400, 300, "sky");
    this.add.text(100, 100, "You're fired!", {
      fontSize: "50px",
      fill: "#ff0000",
    });
    this.input.keyboard.once("keydown", () => {
      this.scene.start("PreloadScene");
    });
  }
}
export default GameOverScene;
