/** marker for detecting walking point
 * @param {number} x - x position
 * @param {number} y - y position
 */
function marker(x, y) {
  this.bitmap = new createjs.Bitmap("images/marker2.png");
  this.bitmap.x = x + 22.5;
  this.bitmap.y = y + 22.5;
  game.stage.addChild(this.bitmap);
};

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
      case 'hellHarpy':
        monster = new HellHarpy(x, y);
        break;
    }
    return monster;
  }
};

/** Collection of possible items */
function ItemCollection() {
  var me = this;
  this.items = {
    basicSword: {
      "image48": "images/sword48px.png",
      "image100": "images/sword100px.png",
      "effect": function() {

      }
    },
    basicAxe: {
      "image48": "images/axe48px.png",
      "image100": "images/axe100px.png",
      "effect": function() {

      }
    },
    coin: {
      "image48": "images/coin.png",
      "image100": "images/coin.png", //not used
      "effect": function() {

      }
    },
    speedPotion: {
      "image48": "images/speedPotion48px.png",
      "image100": "images/speedPotion100px.png",
      "effect": function() {
        game.knight.skills.movementSpeed += 3;
        setTimeout(function() {
          game.knight.skills.movementSpeed -= 3;
        }, 5000)
      }
    },
    healphPotion: {
      "image48": "images/healphPotion48px.png",
      "image100": "images/healphPotion100px.png",
      "effect": function() {
        if (game.knight.knightHP >= game.knight.defaultHP - 5) {
          game.knight.knightHP = game.knight.defaultHP;
        } else {
          game.knight.plusHPKnight(5);
        };
        game.knight.refreshBar(game.knight.knightHP, game.knight.defaultHP, game.knight.hpBar, 20, 50);
      }
    },
    attackPointPotion: {
      "image48": "images/attackpotion48px.png",
      "image100": "images/attackpotion100px.png",
      "effect": function() {
        if (game.knight.knightHP <= 5) {
          game.knight.skills.attack = game.knight.skills.attack + 5;
          setTimeout(function() {
            game.knight.skills.attack = game.knight.skills.attack - 5;
          }, 5000)
        } else {
          game.knight.skills.attack = game.knight.skills.attack + 3;
          setTimeout(function() {
            game.knight.skills.attack = game.knight.skills.attack - 3;
          }, 5000)
        }
      }
    }
  }

  /** Getting 48px image
   * @param {string} itemName - identificator of item
   */
  this.getSmallImage = function(itemName) {
    return me.items[itemName]["image48"];
  };

  /** Getting 48px image
   * @param {string} itemName - identificator of item
   */
  this.getBigImage = function(itemName) {
    return me.items[itemName]["image100"]
  };
}

/** Game inventory */
function Inventory() {
  this.container = new createjs.Container();
  var me = this,
    flagOpen = 0;
  this.slots = [
    { "posX": 10, "posY": 60 },
    { "posX": 130, "posY": 60 },
    { "posX": 250, "posY": 60 },
    { "posX": 10, "posY": 180 },
    { "posX": 130, "posY": 180 },
    { "posX": 250, "posY": 180 },
    { "posX": 10, "posY": 300 },
    { "posX": 130, "posY": 300 },
    { "posX": 250, "posY": 300 }
  ];
  this.itemArray = [
    "basicSword",
    "basicAxe",
    "speedPotion",
    "healphPotion",
    "attackPointPotion"
  ];

  this.containerBitmaps = [];

  var text = new createjs.Text("X " + game.storage.getField("coins"), "40px Arial", "black");
  text.x = 58;

  var inventoryBlockFraction = new Image();
  inventoryBlockFraction.src = "images/network.png";
  var bitmap = new createjs.Bitmap(inventoryBlockFraction);
  bitmap.y = 40;

  var coinImageInv = new Image();
  coinImageInv.src = "images/coin.png";
  var bitmap2 = new createjs.Bitmap(coinImageInv);

  var inventoryBlock = new createjs.Shape();
  inventoryBlock.graphics.beginFill('yellow');
  inventoryBlock.graphics.drawRect(0, 0, 360, 400);

  this.container.x = 20;
  this.container.y = window.innerHeight - 400;

  //this.container.addChild(inventoryBlock);
  this.container.addChild(bitmap);
  this.container.addChild(text);
  this.container.addChild(bitmap2);

  /** Spawn item into stage */
  this.spawnItems = function(itemName, x, y, coinValue) {
    return new me.item(game.itemCollection.getSmallImage(itemName), x, y, itemName, coinValue);
  };

  /** Show looted item to inv
   * @param {string} image - adress of img
   * @param {number} x - x pos
   * @param {number} y - y pos
   */
  this.itemInventory = function(image, x, y) {
    var item = new Image();
    item.src = image;
    var itemInventoryBitmap = new createjs.Bitmap(item);
    itemInventoryBitmap.x = x;
    itemInventoryBitmap.y = y;
    me.container.addChild(itemInventoryBitmap);
    me.containerBitmaps.push(itemInventoryBitmap);
  };

  /** Items construct
   *  @param {string} image - image of imgObject
   *  @param {number} x - x position
   *  @param {number} y - y position
   */
  this.item = function(image, x, y, itemName, coinValue) {
    var bitmapItem = new createjs.Bitmap(image);
    bitmapItem.x = x;
    bitmapItem.y = y;
    game.stage.addChild(bitmapItem);
    bitmapItem.addEventListener("click", function() {
      me.loot(itemName, coinValue, x, y, function() {
        game.stage.removeChild(bitmapItem);
      })
    });
  };

  /** Loot function for items
   * @param {string} itemName - name of droped item
   * @param {number} coinValue - value of monster in coins
   * @param {number} x - x pos
   * @param {number} y - y pos
   * @param {function} lootCallback - callback function
   */
  this.loot = function(itemName, coinValue, x, y, lootCallback) {
    if (game.knight.imgObj.x < x) {
      game.knight.walk(x - 100, y, function() {
        game.knight.imgObj.gotoAndStop("walkRight")
        choosing();
        lootCallback();
      })
    } else {
      game.knight.walk(x + 100, y, function() {
        game.knight.imgObj.gotoAndStop("walkLeft")
        choosing();
        lootCallback();
      })
    };
    /**
     * Saving items info into localStorage and refreshing inventory
     */
    function choosing() {
      switch (itemName) {
        case "coin":
          game.storage.refreshCoins("coins", game.storage.getField("coins"), coinValue);
          break;
        case "basicSword":
        case "speedPotion":
        case "basicAxe":
        case "healphPotion":
        case "attackPointPotion":
          game.storage.refreshItem(itemName, game.storage.getField(itemName), 1);
          break;
      };
      me.refresh();
    };
  };

  /** Reloading view inventory */
  this.refresh = function() {
    var slotIndex = 0;
    var currentItem = null;
    for (var i = 0; i < me.containerBitmaps.length; i++) {
      me.container.removeChild(me.containerBitmaps[i]);
    };
    me.containerBitmaps = [];
    text.text = "X " + game.storage.getField("coins");
    for (var i = 0; i < me.itemArray.length; i++) {
      currentItem = game.storage.getField(me.itemArray[i]);
      if (currentItem) {
        me.itemInventory(game.itemCollection.getBigImage(me.itemArray[i]),
          me.slots[slotIndex].posX,
          me.slots[slotIndex].posY
        );
        slotIndex++;
      };
    };
  };

  me.refresh();

  /** OpenInv */
  this.open = function() {
    flagOpen = 1;
    game.stage.addChild(me.container)
  };

  /** Close Inv */
  this.close = function() {
    flagOpen = 0;
    game.stage.removeChild(me.container);
  };

  /** Toggle function (on key down B) */
  this.toggle = function() {
    if (!flagOpen) {
      me.open();
    } else {
      me.close();
    }
  };

  /** Slot apply
   * @todo Refactor
   */
  this.applySlot = function(number) {
    var slotIndex = 0;
    var currentItem = null;
    for (var i = 0; i < me.itemArray.length; i++) {
      currentItem = game.storage.getField(me.itemArray[i]);
      if (currentItem) {
        slotIndex++;
        if (slotIndex == number) {
          game.storage.refreshItem(me.itemArray[i], game.storage.getField(me.itemArray[i]), -1);
          me.refresh();
          game.itemCollection.items[me.itemArray[i]].effect();
          break;
        };
      };
    };
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

    /** Spawning monsters at start of game */
    me.spawner.createMonster(50, 100, 'snake');
    me.spawner.createMonster(100, 100, 'snake');
    me.spawner.createMonster(150, 100, 'snake');
    me.spawner.createMonster(200, 100, 'snake');
    me.spawner.createMonster(250, 100, 'snake');
    me.spawner.createMonster(300, 100, 'snake');
    me.spawner.createMonster(350, 100, 'snake');
    me.spawner.createMonster(450, 100, 'hellHarpy');
    me.spawner.createMonster(450, 180, 'hellHarpy');
    me.spawner.createMonster(450, 250, 'hellHarpy');

    me.spawner.createMonster(100, 50, 'harpy');
    me.knight = new Knight();

    // setInterval(function(){
    //  me.knight.regen();
    // }, 5000);

    setInterval(function() {
      if (me.knightHP <= 0) {
        alert('gg');
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