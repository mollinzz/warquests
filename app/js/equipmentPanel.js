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

  if (game.itemCollection.items[game.storage.getField("equipedWeapon")]) {
    var attack = game.itemCollection.items[game.storage.getField("equipedWeapon")].attack + game.knight.skills.attack;
  } else {
    var attack = game.knight.skills.attack
  }
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

  this.mainContainer.addChild(mainBlock);
  this.mainContainer.addChild(bitmapWeaponSlot);
  this.mainContainer.addChild(bitmapHelmetSlot);
  this.mainContainer.addChild(bitmapArmorSlot);
  this.mainContainer.addChild(bitmapShoesSlot);
  this.mainContainer.addChild(textAttack);
  this.mainContainer.addChild(textHealph);
  this.mainContainer.addChild(textMana);
  this.mainContainer.addChild(textSpeed);

  this.mainContainer.addEventListener("click", function() {
    return false
  });

  this.equipItem = function(itemName, type) {
    switch (type) {
      case "weapon":
        game.storage.refreshItem(game.storage.getField("equipedWeapon"), 0, 1)
        game.inventory.refresh();
        game.storage.setField("equipedWeapon", itemName);
        weaponSlot.src = game.itemCollection.getBigestImage(itemName);
        me.refresh();
        break;
    };
  };

  this.refresh = function() {
    attack = game.itemCollection.items[game.storage.getField("equipedWeapon")].attack + game.knight.skills.attack;
    textAttack.text = "Attack: " + attack;
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