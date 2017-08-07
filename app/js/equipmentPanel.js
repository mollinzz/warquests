function EquipmentPanel() {
  var flagOpen = 0;
  var me = this;
  this.mainContainer = new createjs.Container();
  this.mainContainer.x = game.stage.canvas.width - 440;
  this.mainContainer.y = game.stage.canvas.height - 380;

  mainBlock = new createjs.Shape();
  mainBlock.graphics.beginFill("gray");
  mainBlock.graphics.drawRect(0, 0, 400, 340);

  weaponSlot = new createjs.Bitmap("images/graySword.png")
  weaponSlot.x = 20;
  weaponSlot.y = 20;

  helmetSlot = new createjs.Bitmap("images/grayHelmet.png")
  helmetSlot.x = 140;
  helmetSlot.y = 20;

  armorSlot = new createjs.Bitmap("images/grayArmor.png")
  armorSlot.x = 140;
  armorSlot.y = 120;

  shoesSlot = new createjs.Bitmap("images/grayShoes.png")
  shoesSlot.x = 140;
  shoesSlot.y = 220;

  textAttack = new createjs.Text("Attack: " + game.knight.skills.attack, "20px Arial", "black");
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
  this.mainContainer.addChild(weaponSlot);
  this.mainContainer.addChild(armorSlot);
  this.mainContainer.addChild(helmetSlot);
  this.mainContainer.addChild(shoesSlot);
  this.mainContainer.addChild(textAttack);
  this.mainContainer.addChild(textHealph);
  this.mainContainer.addChild(textMana);
  this.mainContainer.addChild(textSpeed);

  this.mainContainer.addEventListener("click", function() {
    return false
  });

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