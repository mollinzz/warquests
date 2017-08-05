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
    "attackPointPotion",
    "manaPotion"
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
        case "manaPotion":
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
          if (game.itemCollection.items[me.itemArray[i]]["disableApply"]) {
            break;
          }
          me.refresh();
          game.itemCollection.items[me.itemArray[i]].effect();
          game.storage.refreshItem(me.itemArray[i], game.storage.getField(me.itemArray[i]), -1)
          me.refresh();
          break;
        };
      };
    };
  };
};

/** Collection of possible items */
function ItemCollection() {
  var me = this;
  this.items = {
    basicSword: {
      "image48": "images/sword48px.png",
      "image100": "images/sword100px.png",
      "effect": function() {

      },
      "disableApply": true
    },
    basicAxe: {
      "image48": "images/axe48px.png",
      "image100": "images/axe100px.png",
      "effect": function() {

      },
      "disableApply": true
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
        //callback();
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
        //callback();
        game.knight.refreshBar(game.knight.knightHP, game.knight.defaultHP, game.knight.hpBar, 20, 50);
      }
    },
    attackPointPotion: {
      "image48": "images/attackpotion48px.png",
      "image100": "images/attackpotion100px.png",
      "effect": function() {
        if (game.knight.knightHP <= 5) {
          game.knight.skills.attack = game.knight.skills.attack + 5;
          //callback()
          setTimeout(function() {
            game.knight.skills.attack = game.knight.skills.attack - 5;
          }, 5000)
        } else {
          game.knight.skills.attack = game.knight.skills.attack + 3;
          //callback();
          setTimeout(function() {
            game.knight.skills.attack = game.knight.skills.attack - 3;
          }, 5000)
        }
      }
    },
    manaPotion: {
      "image48": "images/manaPotion48px.png",
      "image100": "images/manaPotion100px.png",
      "effect": function() {
        if (game.knight.manaPoints == game.knight.defaultMana) {
          return false;
        };
        if (game.knight.manaPoints >= game.knight.defaultMana - 3) {
          game.knight.manaPoints = game.knight.defaultMana;
          game.knight.refreshBar(game.knight.manaPoints, game.knight.defaultMana, game.knight.manaBar, 70, 25, "#005aff");
        } else {
          game.knight.manaPoints += 3;
          game.knight.refreshBar(game.knight.manaPoints, game.knight.defaultMana, game.knight.manaBar, 70, 25, "#005aff");
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

  /** Getting 100px image
   * @param {string} itemName - identificator of item
   */
  this.getBigImage = function(itemName) {
    return me.items[itemName]["image100"]
  };
}