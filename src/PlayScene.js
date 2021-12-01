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
var angle;
class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.spritesheet("dev", "assets/dev_sprite.png", {
      frameWidth: 85,
      frameHeight: 85,
    });
    this.load.image("fix", "assets/fix.png");
    this.load.spritesheet("bug", "assets/bug_sprite.png", {
      frameWidth: 93,
      frameHeight: 90,
    });
    this.load.audio("bug", "assets/bug.wav");
    this.load.audio("fix", "assets/fix.wav");
  }

  create() {
    //  A simple background for our game
    this.add.image(400, 300, "background");

    // The player and its settings
    player = this.physics.add.sprite(400, 300, "dev");
    player.setAngularVelocity(angularVelocity);
    player.rotation = true;

    //  the player animations
    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNumbers("dev", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    //Input Events
    cursors = this.input.keyboard.createCursorKeys();
    shot = cursors.space;
    speed = cursors.shift;

    //The dev weapon
    weapons = this.physics.add.group();
    this.sound.add("fix", { rate: 1 });

    //The enemies
    bugs = this.physics.add.group();
    this.sound.add("bug", { rate: 1 });

    //the enemies animation
    this.anims.create({
      key: "bug_move",
      frames: this.anims.generateFrameNumbers("bug", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });

    //  The score
    scoreText = this.add.text(16, 0, "score: 0", {
      fontSize: "32px",
      fontFamily: "Ceviche One",
      fill: "#b3347b",
    });

    // The lives
    livesText = this.add.text(700, 0, "lives: " + lives, {
      fontSize: "32px",
      fontFamily: "Ceviche One",
      fill: "#b3347b",
    });

    //handle collisions
    this.physics.add.collider(weapons, bugs, destroyBug, null, this);

    function destroyBug(fix, bug) {
      bug.destroy();
      fix.destroy();
      this.sound.play("fix");
      //  Add and update the score
      score += 10;
      scoreText.setText("Score: " + score);
      if (score % 50 == 0 && lives < 10) {
        lives++;
        livesText.setText("lives: " + lives);
      }
    }
  }

  update() {
    if (gameOver) {
      resetValues();
      this.scene.start("GameOverScene");
      this.sound.stopAll();
    }

    player.anims.play("move", true);

    // send a new bug in
    let randomMistake = Phaser.Math.Between(1, 1000);
    if (randomMistake > 990 && !newBugOut) {
      let path = generatePath();
      let bug = this.add.follower(path, 400, 300, "bug");
      bugs.add(bug);
      bug.body.onWorldBounds = true;
      bug.body.setCollideWorldBounds(true);
      this.sound.play("bug");
      bug.startFollow({
        duration: path.getLength() * 5,
        rotateToPath: true,
        rotationOffset: 45,
      });

      bug.anims.play("bug_move", true);
      //avoid having two bugs coming out at the same time
      newBugOut = true;
      this.time.addEvent({
        delay: 400,
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

    function generatePath() {
      let path = new Phaser.Curves.Path(400, 300);
      let x = 400;
      let y = 300;
      let random = Phaser.Math.Between(1, 4);
      switch (random) {
        //x towards 800 , y towards 0
        case 1: {
          for (let i = 0; i < 6; i++) {
            x = Phaser.Math.Between(x, 800);
            y = Phaser.Math.Between(0, y);
            path.lineTo(x, y);
          }
          break;
        }
        //x towards 0 , y towards 600
        case 2: {
          for (let i = 0; i < 6; i++) {
            x = Phaser.Math.Between(0, x);
            y = Phaser.Math.Between(y, 600);
            path.lineTo(x, y);
          }
          break;
        }
        //x towards 0 , y towards 0
        case 3: {
          for (let i = 0; i < 6; i++) {
            x = Phaser.Math.Between(0, x);
            y = Phaser.Math.Between(0, y);
            path.lineTo(x, y);
          }
          break;
        }
        //x towards 800 , y towards 600
        default:
          {
            for (let i = 0; i < 6; i++) {
              x = Phaser.Math.Between(x, 800);
              y = Phaser.Math.Between(y, 600);
              path.lineTo(x, y);
            }
          }
          break;
      }
      return path;
    }
  }
}

export default PlayScene;
