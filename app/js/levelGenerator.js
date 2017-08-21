function LevelGenerate() {
  this.createInterface = function() {
    game.stage.clear();
    game.stage.removeAllChildren();
    game.stage.update();
    game.stage.addChild(game.bg1);
    game.knight = new Knight();
    game.knight.weaponObj = game.equipmentPanel.getWeaponObj(game.storage.getField("equipedWeapon"));
    game.knight.weaponObj.gotoAndStop("walkRight");
    game.knight.weaponObj.y = 15;
    game.knight.weaponObj.x = 10;
    game.knight.container.addChild(game.knight.weaponObj);
    game.stage.addChild(game.abilityPanel.container);
    game.abilityFlag = 0;
  };
};