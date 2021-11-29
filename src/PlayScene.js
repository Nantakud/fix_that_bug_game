import Phaser from "phaser";

var player;
var shot;
var speed;
var weapons;
var bugs;
export var score = 0;
export var gameOver = false;
export var scoreText;
export var livesText;
var hasShooted = false;
var newBugOut = false;
export var lives = 10;
var cursors;
var angularVelocity = 25;
var angularAcceleration = 1000;
class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("dev", "assets/dev.png");
    this.load.image("fix", "assets/fix.png");
    this.load.image("bug", "assets/bug.png");
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, "sky");

    // The player and its settings
    player = this.physics.add.image(400, 300, "dev");
    player.setAngularVelocity(angularVelocity);
    player.rotation = true;

    //Input Events
    cursors = this.input.keyboard.createCursorKeys();
    shot = cursors.space;
    speed = cursors.shift;

    //The dev weapon
    weapons = this.physics.add.group();

    //The enemies
    bugs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    // The lives
    livesText = this.add.text(560, 16, "lives: " + lives, {
      fontSize: "32px",
      fill: "#000",
    });

    //handle collisions
    this.physics.add.collider(weapons, bugs, destroyBug, null, this);

    function destroyBug(fix, bug) {
      bug.destroy();
      fix.destroy();
      //  Add and update the score
      score += 10;
      scoreText.setText("Score: " + score);
      if (score % 70 == 0 && lives < 10) {
        lives++;
        livesText.setText("lives: " + lives);
      }
    }
  }

  update() {
    if (gameOver) {
      this.add.text(300, 300, "GAME OVER!", {
        fontSize: "50px",
        fill: "#ff0000",
      });
      resetValues();
      this.game.scene.dump();
      this.scene.start("GameOverScene");
    }

    // send a new bug in
    let randomMistake = Phaser.Math.Between(1, 1000);
    if (randomMistake > 990 && !newBugOut) {
      let randomX = Phaser.Math.Between(-130, 130);

      //  Add and update the score

      let randomY = Phaser.Math.Between(-280, 300);
      let bug = bugs.create(400, 300, "bug");
      bug.setVelocity(randomX, randomY);
      bug.angle = player.angle;
      bug.body.onWorldBounds = true;
      bug.setCollideWorldBounds(true);

      //avoid to have two bugs coming out at the same time
      newBugOut = true;
      this.time.addEvent({
        delay: 300,
        callback: () => {
          newBugOut = false;
        },
      });
    }
    //when a bug or fix  reach the world edge
    this.physics.world.on("worldbounds", (body) => {
      if (bugs.contains(body.gameObject)) updateLivesCount();
      body.gameObject.destroy();
    });

    //shot a fix
    if (shot.isDown && !hasShooted) {
      let radians = Phaser.Math.DegToRad(player.angle);
      let fireStartX = this.game.config.width / 2;
      let fireStartY = this.game.config.height / 2;
      let fireEndX = fireStartX * Math.cos(radians);
      let fireEndY = fireStartY * Math.sin(radians);
      var fix = weapons.create(400, 300, "fix");
      fix.setVelocity(fireEndX * 20, fireEndY * 20);
      fix.body.onWorldBounds = true;
      fix.setCollideWorldBounds(true);

      //avoid to have two fix coming out at the same time
      hasShooted = true;
      this.time.addEvent({
        delay: 300,
        callback: () => {
          hasShooted = false;
        },
      });
    }

    //regulates player rotation
    if (speed.isDown) {
      player.setAngularAcceleration(angularAcceleration);
    }
    if (speed.isUp) {
      player.setAngularAcceleration(0);
      player.setAngularDrag(2000);
      player.setAngularDrag(0);
      player.setAngularVelocity(angularVelocity);
    }

    if (cursors.left.isDown) {
      angularVelocity = -25;
      angularAcceleration = -1000;
    }
    if (cursors.right.isDown) {
      angularVelocity = 25;
      angularAcceleration = 1000;
    }

    function updateLivesCount() {
      lives--;
      livesText.setText("lives: " + lives);
      if (lives < 1) {
        gameOver = true;
      }
    }

    function resetValues() {
      lives = 10;
      gameOver = false;
      score = 0;
    }
  }
}

export default PlayScene;
