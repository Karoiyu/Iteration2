let gameScene = new Phaser.Scene('Game');

let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene
};




gameScene.init = function() {
  this.playerSpeed = 1.5;
  this.enemySpeed = 2;
  this.enemyMaxY = 280;
  this.enemyMinY = 80;
}


gameScene.preload = function() {


  this.load.image('background', 'assets/background.png');
  this.load.spritesheet('slime', 'assets/slime.png', { frameWidth: 16, frameHeight: 16 });
  this.load.image('flameDemon', 'assets/flameDemon.png');
  this.load.image('treasure', 'assets/treasure.png');
  this.load.image('tileset', 'assets/tileset.png');
  this.load.image('menu', 'assets/startButton.png');
  this.load.tilemapTiledJSON("tilemap", "assets/level.json");
};

gameScene.create = function() {

  this.map = this.make.tilemap({key: "tilemap"});
  var landscape = this.map.addTilesetImage("tileset", "tileset");
  this.map.createStaticLayer('Tile Layer 2', landscape, 0, 0);
  this.map.createStaticLayer('Tile Layer 1', landscape, 0, 0);
  this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

  this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'slime');

  this.player.setScale(1.5);

  this.treasure = this.add.sprite(this.sys.game.config.width - 60, this.sys.game.config.height / 2, 'treasure');
  this.treasure.setScale(0.01);

  this.enemies = this.add.group({
    key: 'flameDemon',
    repeat: 5,
    setXY: {
      x: 110,
      y: 100,
      stepX: 80,
      stepY: 20
    }
  });

  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
    enemy.speed = Math.random() * 2 + 1;
  }, this);

  this.isPlayerAlive = true;
  

  
var pointer = this.input.activePointer;
console.log(pointer);
var x = pointer.x;
var y = pointer.y;
if (pointer.isDown) {
    var touchX = pointer.x;
    var touchY = pointer.y;
var worldX = pointer.worldX;
var worldY = pointer.worldY;

}

  this.cameras.main.resetFX();
  
  
};

gameScene.update = function() {

	
	
  if (!this.isPlayerAlive) {
    return;
  }

  if (this.input.activePointer.isDown) {

    this.player.x += this.playerSpeed;
  }
 

  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
    this.win();
  }

  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i = 0; i < numEnemies; i++) {

    enemies[i].y += enemies[i].speed;

    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }

    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
      this.gameOver();
      break;
    }
  }
};

gameScene.gameOver = function() {

  this.isPlayerAlive = false;

  this.cameras.main.shake(500);

  this.time.delayedCall(50, function() {
    this.cameras.main.fade(250);
  }, [], this);


  this.time.delayedCall(300, function() {
    this.scene.restart();
  }, [], this);
};




gameScene.win = function() {

  this.isPlayerAlive = true;

  this.time.delayedCall(150, function() {
    this.cameras.main.fade(500);
  }, [], this);


  this.time.delayedCall(500, function() {
    this.scene.restart();
  }, [], this);
};

let game = new Phaser.Game(config);
