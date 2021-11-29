import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("logo", "assets/logo.png");
  }
  create() {
    this.game.scene.dump();
    this.add.image(400, 300, "logo");
    this.input.keyboard.once("keydown", () => {
      this.scene.start("PlayScene");
    });
  }
}

export default PreloadScene;
