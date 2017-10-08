function Market() {
  var me = this;
  this.openFlag = 0;
  var currentType = null;
  this.container = new createjs.Container();
  this.container.x = game.stage.canvas.width / 2 - 600;
  this.container.y = game.stage.canvas.height / 2 - 400;
  this.container.frontFlag = true;

  mainBlock = new createjs.Shape();
  mainBlock.graphics.beginFill('yellow');
  mainBlock.graphics.drawRect(0, 0, 1200, 800);
  mainBlock.addEventListener("click", function() {
    return false;
  })

  exitButton = new createjs.Shape();
  exitButton.graphics.beginFill('black');
  exitButton.graphics.drawRect(0, 0, 100, 40);
  exitButton.addEventListener("click", function() {
    me.close();
  });

  var potionShop = new createjs.Container();
  var speedPotion = MarketBuySlot("speedPotion", 50, 50, potionShop);
  var healPotion = MarketBuySlot("healphPotion", 200, 50, potionShop);

  var weaponShop = new createjs.Container();
  var basicAxe = MarketBuySlot("basicAxe", 50, 50, weaponShop);
  var basicSword = MarketBuySlot("basicSword", 200, 50, weaponShop);

  this.container.addChild(mainBlock);
  this.container.addChild(exitButton);

  this.buy = function(itemName) {
    if (game.storage.getField("coins") < game.itemCollection.items[itemName].coinValue) {
      return false;
    }
    game.storage.refresh("coins", game.storage.getField("coins"), -game.itemCollection.items[itemName].coinValue)
    game.storage.refresh(itemName, game.storage.getField(itemName), 1);
    game.inventory.refresh();
    game.alert.createAlert(game.alert.alertCollection.bought + itemName)
  };

  this.open = function(shopType) {
    if (me.openFlag = 0) {
      return false;
    };
    if (!game.stage.container) { game.stage.addChild(game.inventory.container) };
    game.stage.removeChild(game.inventory.container);
    me.container.addChild(game.inventory.container);
    game.inventory.container.x = 600;
    game.inventory.container.y = 400;
    currentType = shopType;
    me.openFlag = 1;
    game.knight.actionsFlag++;
    game.stage.addChild(me.container);
    switch (shopType) {
      case "potionShop":
        me.container.addChild(potionShop);
        break;
      case "weaponShop":
        me.container.addChild(weaponShop);
        break;
    }
  };

  this.sell = function(item) {
    game.storage.refresh("coins", game.storage.getField("coins"), game.itemCollection.items[item].coinValue);
    game.storage.refresh(item, game.storage.getField(item), -1);
    game.inventory.refresh();
  };

  this.close = function() {
    switch (currentType) {
      case "weaponShop":
        me.container.removeChild(weaponShop);
        break;
      case "potionShop":
        me.container.removeChild(potionShop);
    };
    me.container.removeChild(game.inventory.container);
    game.stage.addChild(game.inventory.container);
    currentType = null;
    me.openFlag = 0;
    game.knight.actionsFlag--;
    game.stage.removeChild(me.container);
    game.inventory.container.x = game.inventory.containerPosX;
    game.inventory.container.y = game.inventory.containerPosY;
    if (!game.inventory.flagOpen) {
      game.inventory.close();
    }
  };
};

function MarketBuySlot(itemName, x, y, container) {
  var image = new createjs.Bitmap(game.itemCollection.getBigImage(itemName));
  container.addChild(image);
  image.x = x;
  image.y = y;

  var buyButtonSprite = new createjs.SpriteSheet({
    "animations": {
      "default": {
        "frames": [0]
      },
      "clicked": {
        "frames": [1]
      }
    },
    "images": ["images/buybutton.png"],
    "frames": {
      "width": 100,
      "height": 100,
      "regX": 0,
      "regY": 0
    }
  });

  var buyButton = new createjs.Sprite(buyButtonSprite);
  buyButton.x = x;
  buyButton.y = y + 100 + 10
  container.addChild(image);
  container.addChild(buyButton);

  buyButton.addEventListener("click", function() {
    game.market.buy(itemName);
  });

  coinText = new createjs.Text(game.itemCollection.items[itemName].coinValue, "28px Arial", "black")
  coinText.x = x + 10;
  coinText.y = y + 100 + 50 + 20;
  container.addChild(coinText);

  coinImg = new createjs.Bitmap("images/coin.png")
  container.addChild(coinImg)
  coinImg.x = x + 10 + 50;
  coinImg.y = y + 100 + 70;
};