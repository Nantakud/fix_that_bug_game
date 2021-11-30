import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("cover", "assets/cover.png");
  }
  create() {
    this.add.image(400, 300, "cover");
    this.input.keyboard.once("keydown", () => {
      this.scene.start("PlayScene");
    });
  }
}

export default PreloadScene;
