/** Saving objects to localStorage */
function Storage() {
  var me = this;
  this.object = {};
  /** Saving */
  this.save = function() {
    var sObj = JSON.stringify(this.object);
    localStorage.setItem("object", sObj);
  };

  /** Loading */
  this.load = function() {
    me.object = JSON.parse(localStorage.getItem("object"));
    if (me.object == null) {
      me.object = {};
    }
  };
  this.load();

  /** Adding it to loacal storage */
  this.setField = function(itemKey, itemVal) {
    me.object[itemKey] = itemVal;
    me.save();
  };

  /** Getting from loacal storage */
  this.getField = function(itemKey) {
    return me.object[itemKey];
  };

  /* Refreshing coins*/
  this.refreshCoins = function(itemKey, itemValOld, coinValue) {
    if (!itemValOld) {
      itemValOld = 0;
    }
    localStorage.removeItem(itemKey);
    this.setField(itemKey, itemValOld + coinValue);
  };

  /** Refreshing items */
  this.refreshItem = function(itemKey, itemValOld, coinValue) {
    if (!itemValOld) {
      itemValOld = 0;
    }
    // localStorage.removeItem(itemKey);
    this.setField(itemKey, itemValOld + coinValue);
  };

  /** Removing from local storage */
  this.remove = function(itemKey) {
    localStorage.removeItem(itemKey);
  };
};

/** Spawner of monsters */
function MonsterSpawner() {
  var me = this;
  var countMonster = 0;

  /** Spawning monster with random
   * @param {number} number - number of spawning monsters
   * @param {string} monsterName - name of monster
   */
  this.randomMachine = function(number, monsterName) {
    for (var i = 1; i <= number; i++) {
      me.createMonster(
        Math.random() * game.stage.canvas.width,
        Math.random() * game.stage.canvas.height,
        monsterName
      );
    }
  };

  /** Spawning monsters 
   * @param {number} x - x pos
   * @param {number} y - y pos
   * @param {string} monsterName - name of monster to switch constructor
   */
  this.createMonster = function(x, y, monsterName) {
    countMonster++;
    var monster;
    switch (monsterName) {
      case 'snake':
        monster = new Snake(x, y);
        break;
      case 'harpy':
        monster = new Harpy(x, y);
        break;
      case 'reaper':
        monster = new Reaper(x, y);
        break;
    }
    return monster;
  }
};

function AbilityPanel() {
  var me = this;
  var container = new createjs.Container();
  game.stage.addChild(container);
  container.x = game.stage.canvas.width / 2 - 200;
  container.y = game.stage.canvas.height - 129;

  var mainBlock = new createjs.Shape();
  mainBlock.graphics.beginFill('yellow');
  mainBlock.graphics.drawRect(0, 0, 321, 109);
  container.addChild(mainBlock);

  var slamImage = new createjs.SpriteSheet({
    "animations": {
      "notUsed": {
        "frames": [0]
      },
      "used": {
        "frames": [1]
      }
    },
    "images": ["images/slam.png"],
    "frames": {
      "height": 100,
      "width": 100,
      "regX": 0,
      "regY": 0
    }
  });
  this.slamSprite = new createjs.Sprite(slamImage);
  this.slamSprite.gotoAndStop("notUsed");
  createjs.Tween.get(this.slamSprite)
    .to({ x: 3, y: 3 });

  var healImage = new createjs.SpriteSheet({
    "animations": {
      "notUsed": {
        "frames": [0]
      },
      "used": {
        "frames": [1]
      }
    },
    "images": ["images/heal.png"],
    "frames": {
      "height": 100,
      "width": 100,
      "regX": 0,
      "regY": 0
    }
  });
  this.healSprite = new createjs.Sprite(healImage);
  this.healSprite.gotoAndStop("notUsed");
  createjs.Tween.get(this.healSprite)
    .to({ x: 109, y: 3 });

  container.addChild(this.healSprite);
  container.addChild(this.slamSprite);

  this.changeImage = function(abilityImage) {
    abilityImage.gotoAndStop("used");
    setTimeout(function() {
      abilityImage.gotoAndStop("notUsed");
    }, 300);
  };
  this.rollback = function(rollbackTime) {
    var time = rollbackTime;
    for (var i; i < rollbackTime; setTimeout(function(){i++; time--;}, 1000)) {
      alert()
      var text = new createjs.Text(time, "40px Arial", "red");
      container.addChild(text)
    }
  };

};

/** Main game func */
function Game(stageId) {
  // code here.
  var me = this;
  this.storage = new Storage();
  this.stage = new createjs.Stage(stageId);
  me.spawner = new MonsterSpawner();
  // this.items = new Items();
  this.itemCollection = new ItemCollection();
  this.start = function() {
    this.inventory = new Inventory();
    // fullscreen canvas
    //window.addEventListener('resize', me.resizeCanvas, false);
    me.resizeCanvas = function() {
      me.stage.canvas.width = window.innerWidth;
      me.stage.canvas.height = window.innerHeight;
    };
    me.resizeCanvas();
    // canvas background  
    var bg1 = new createjs.Shape();
    bg1.graphics.beginFill("#51d977"); // first bg
    bg1.graphics.drawRect(
      0, // x position
      0, // y position
      me.stage.canvas.width, // width of shape (in px)
      me.stage.canvas.height // height of shape (in px)
    );
    // Can only define this after shape is drawn, else no fill applies

    bg1.graphics.ef(); // short for endFill()
    me.stage.addChild(bg1); // Add Child to Stage
    //monsterSprites, standFrames, image, spriteHeight, spriteWidth, x, y, monsterHP, monsterhpbar,
    //widthBar, heightBar
    this.abilityPanel = new AbilityPanel();
    /** Spawning monsters at start of game */
    me.spawner.createMonster(50, 100, 'snake');
    me.spawner.createMonster(100, 100, 'snake');
    me.spawner.createMonster(150, 100, 'snake');
    me.spawner.createMonster(200, 100, 'snake');
    me.spawner.createMonster(250, 100, 'snake');
    me.spawner.createMonster(300, 100, 'snake');
    me.spawner.createMonster(350, 100, 'snake');
    me.spawner.createMonster(450, 100, 'reaper');
    me.spawner.createMonster(450, 180, 'reaper');
    me.spawner.createMonster(450, 250, 'reaper');
    me.spawner.createMonster(100, 50, 'harpy');
    me.spawner.createMonster(100, 200, 'harpy');
    me.knight = new Knight();

    var factor;
    var factor2;
    setInterval(function() {
      factor = Math.random() * 3000;
      setTimeout(function() {
        me.knight.regen(me.knight.knightHP, me.knight.defaultHP, me.knight.hpBar, 20, 50, "#e50707");
      }, factor);
    }, 5000);

    setInterval(function() {
      factor2 = Math.random() * 5000;
      setTimeout(function() {
        // alert(me.knight.regen)
        me.knight.regen(me.knight.manaPoints, me.knight.defaultMana, me.knight.manaBar, 70, 25, "#005aff");
      }, factor2);
    }, 6000);

    setInterval(function() {
      if (me.knight.knightHP <= 0) {
        me.knight.die();
        setTimeout(function() {
          location.reload();
        }, 1000)
      }
    }, 100)

    me.stage.update();
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", handleEvent);

    function handleEvent() {
      me.stage.update();
    }
  };
}