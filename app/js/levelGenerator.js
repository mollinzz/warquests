function LevelGenerate() {
  this.createInterface = function() {
    game.stage.clear();
    game.stage.removeAllChildren();
    game.stage.update();
    game.stage.addChild(game.abilityPanel.container);
    game.abilityFlag = 0;
  };

  this.createlevel = function(level) {
    settings = levelSettings[level];
    if (settings.type == "home") {
      game.showAbility = 0;
    };
    this.createInterface();
    var bgColor = (settings.bgColor) ? settings.bgColor : "#51d977";
    this.bg1 = new createjs.Shape();
    this.bg1.graphics.beginFill(bgColor); // first bg
    this.bg1.graphics.drawRect(
      0,
      0,
      game.stage.canvas.width,
      game.stage.canvas.height
    );
    game.stage.addChild(this.bg1);
    game.knight = new Knight();
    game.knight.weaponObj = game.equipmentPanel.getWeaponObj(game.storage.getField("equipedWeapon"));
    game.knight.weaponObj.gotoAndStop("walkRight");
    game.knight.weaponObj.y = 15;
    game.knight.weaponObj.x = 10;
    game.knight.container.addChild(game.knight.weaponObj);

    if (settings.decor) {
      for (var i = 0; i < settings.decor.length; i++) {
        var decorItem = settings.decor[i];
        if (decorItem['options']) {
          createFromSettings(decorItem['name'], decorItem['x'], decorItem['y'], decorItem['options'])
        } else {
          createFromSettings(decorItem['name'], decorItem['x'], decorItem['y']);
        }
      };
    };

    if (settings.monsters) {
      for (var i = 0; i < settings.monsters.length; i++) {
        var monsterItem = settings.monsters[i];
        game.spawner.randomMachine(monsterItem['value'], monsterItem['name'])
      };
    };
  };

};
