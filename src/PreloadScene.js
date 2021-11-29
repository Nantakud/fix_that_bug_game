import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("dev", "assets/dev.png");
    this.load.image("fix", "assets/fix.png");
    this.load.image("bug", "assets/bug.png");
    this.load.image("logo", "assets/logo.png");
  }

  create() {
    this.scene.start("PlayScene");
  }
}

export default PreloadScene;
