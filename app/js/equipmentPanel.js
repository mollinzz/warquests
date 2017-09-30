function EquipmentPanel() {
  var flagOpen = 0;
  var me = this;
  // if (!game.storage.getField('equipedArmor') || !game.storage.getField('equipedSword')) {
  //   game.storage.setField('equipedArmor', "basicArmor");
  //   game.storage.setField('equipedWeapon', "electroforez");
  // }
  this.mainContainer = new createjs.Container();
  this.mainContainer.x = game.stage.canvas.width - 440;
  this.mainContainer.y = game.stage.canvas.height - 380;

  mainBlock = new createjs.Shape();
  mainBlock.graphics.beginFill("gray");
  mainBlock.graphics.drawRect(0, 0, 400, 340);

  weaponSlot = new Image();
  if (!game.storage.getField("equipedWeapon")) {
    weaponSlot.src = "images/graySword.png";
  } else {
    weaponSlot.src = game.itemCollection.getBigestImage(game.storage.getField("equipedWeapon"));
  }
  var bitmapWeaponSlot = new createjs.Bitmap(weaponSlot);
  bitmapWeaponSlot.x = 20;
  bitmapWeaponSlot.y = 20;

  helmetSlot = new Image();
  helmetSlot.src = "images/grayHelmet.png";
  var bitmapHelmetSlot = new createjs.Bitmap(helmetSlot);
  bitmapHelmetSlot.x = 140;
  bitmapHelmetSlot.y = 20;

  armorSlot = new Image();
  armorSlot.src = "images/grayArmor.png";
  var bitmapArmorSlot = new createjs.Bitmap(armorSlot);
  bitmapArmorSlot.x = 140;
  bitmapArmorSlot.y = 120;

  shoesSlot = new Image();
  shoesSlot.src = "images/grayShoes.png";
  var bitmapShoesSlot = new createjs.Bitmap(shoesSlot);
  bitmapShoesSlot.x = 140;
  bitmapShoesSlot.y = 220;

  var attack = game.knight.skills.attack;
  if (game.itemCollection.items[game.storage.getField("equipedWeapon")]) {
    attack += game.itemCollection.items[game.storage.getField("equipedWeapon")].attack;
  };

  textAttack = new createjs.Text("Attack: " + attack, "20px Arial", "black");
  textAttack.x = 260;
  textAttack.y = 20;

  textHealph = new createjs.Text("Max healph: " + game.knight.defaultHP, "20px Arial", "black");
  textHealph.x = 260;
  textHealph.y = 45;

  textMana = new createjs.Text("Max mana: " + game.knight.defaultMana, "20px Arial", "black");
  textMana.x = 260;
  textMana.y = 70;

  textSpeed = new createjs.Text("Speed: " + game.knight.skills.movementSpeed * 100, "20px Arial", "black");
  textSpeed.x = 260;
  textSpeed.y = 95;

  var levelPointsText = new createjs.Text("EXP: " + game.storage.getField("levelPoints"), "20px Arial", "black");
  levelPointsText.x = 260;
  levelPointsText.y = 120;

  var levelText = new createjs.Text("Level: " + game.storage.getField("level"), "20px Arial", "black");
  levelText.x = 260;
  levelText.y = 145;
  var dragger = new createjs.Shape();
  dragger.graphics.beginFill('gray');
  dragger.graphics.drawRect(0, 0, 400, 20);
  dragger.on("pressmove", function(event) {
    // currentTarget will be the container that the event listener was added to:
    me.mainContainer.x = event.stageX - 200;
    me.mainContainer.y = event.stageY;
    // make sure to redraw the stage to show the change:
  });

  this.mainContainer.addChild(mainBlock);
  this.mainContainer.addChild(bitmapWeaponSlot);
  this.mainContainer.addChild(bitmapHelmetSlot);
  this.mainContainer.addChild(bitmapArmorSlot);
  this.mainContainer.addChild(bitmapShoesSlot);
  this.mainContainer.addChild(textAttack);
  this.mainContainer.addChild(textHealph);
  this.mainContainer.addChild(textMana);
  this.mainContainer.addChild(textSpeed);
  this.mainContainer.addChild(levelPointsText);
  this.mainContainer.addChild(levelText);
    this.mainContainer.addChild(dragger);

  this.mainContainer.addEventListener("click", function() {
    return false
  });

  this.equipItem = function(itemName, type) {
    switch (type) {
      case "weapon":
        game.inventory.refresh();
        if (game.storage.getField(itemName) == 0) {
          game.storage.refresh(game.storage.getField("equipedWeapon"), 0, 1)
        } else {
          game.storage.refresh(game.storage.getField("equipedWeapon"), game.storage.getField(game.storage.getField("equipedWeapon")), 1);
        };
        game.storage.setField("equipedWeapon", itemName);
        game.inventory.refresh();
        weaponSlot.src = game.itemCollection.getBigestImage(itemName);
        game.knight.container.removeChild(game.knight.weaponObj);
        game.knight.weaponObj = me.getWeaponObj(itemName);
        game.knight.weaponObj.y = 15;
        game.knight.weaponObj.x = 10;
        game.knight.container.addChild(game.knight.weaponObj);
        me.refresh();
        break;
    };
  };

  this.getWeaponObj = function(itemName) {
    if (!game.storage.getField("equipedWeapon")) {
      image = ""
    } else { image = game.itemCollection.getWeaponFrameImage(itemName) }

    return new createjs.Sprite(new createjs.SpriteSheet({
      "animations": {
        "walkRight": {
          "frames": [5]
        },
        "walkLeft": {
          "frames": [0]
        },
        "attackRight": {
          "frames": [0, 1, 2, 1],
          "speed": 0.1
        },
        "attackLeft": {
          "frames": [3, 4, 5],
          "speed": 0.1
        },
      },
      "images": [image],
      "frames": {
        "height": 127.5,
        "width": 127.5,
        "regX": 0,
        "regY": 0
      }
    }));
  };

  game.knight.weaponObj = me.getWeaponObj(game.storage.getField("equipedWeapon"));
  game.knight.weaponObj.gotoAndStop("walkRight");
  game.knight.weaponObj.y = 15;
  game.knight.weaponObj.x = 10;
  game.knight.container.addChild(game.knight.weaponObj);
  this.refresh = function() {
    attack = game.knight.skills.attack;
    if (game.storage.getField("equipedWeapon")) {
      attack = game.itemCollection.items[game.storage.getField("equipedWeapon")].attack + game.knight.skills.attack;
    };
    textAttack.text = "Attack: " + attack;
    levelPointsText.text = "EXP: " + game.storage.getField("levelPoints");
    levelText.text = "Level: " + game.storage.getField("level");
  };

  this.open = function() {
    flagOpen = 1;
    game.stage.addChild(this.mainContainer)
  };

  this.close = function() {
    flagOpen = 0;
    game.stage.removeChild(this.mainContainer)
  };

  this.toggle = function() {
    if (!flagOpen) {
      me.open();
    } else {
      me.close();
    }
  };
};

var levels = {
  1: {
    "XP": 0,
    "coins": 0
  },
  2: {
    "XP": 10,
    "coins": 5
  },
  3: {
    "XP": 20,
    "coins": 7
  },
  4: {
    "XP": 35,
    "coins": 10
  },
  5: {
    "XP": 50,
    "coins": 12
  },
  6: {
    "XP": 70,
    "coins": 15
  },
};