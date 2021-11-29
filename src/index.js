import Phaser from "phaser";
import PlayScene from "./PlayScene";
import PreloadScene from "./PreloadScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  transparent: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [PreloadScene, PlayScene],
};

var game = new Phaser.Game(config);
