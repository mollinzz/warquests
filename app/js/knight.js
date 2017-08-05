/** Main hero
 * @constructor
 */
function Knight() {
  var healAbilityFlag = 0;
  var slamAbilityFlag = 0;
  this.knightHP = 15;
  this.manaPoints = 10;
  var actionsFlag = 0;
  var me = this;
  this.defaultHP = this.knightHP;
  var factorKnight;
  var apple;
  this.direction = 1; // right direction
  this.dirSettings = [
    { "walk": "walkLeft" },
    { "walk": "walkRight" }
  ];
  this.skills = {
    shieldBlock: 1,
    slam: 2,
    movementSpeed: 0.3,
    extraAttack: 0,
    attack: 10,
  };
  this.defaultMana = this.manaPoints;

  /** Sprites setting */
  var knightSprites = new createjs.SpriteSheet({
    "animations": {
      "walkRight": {
        "frames": [0, 3],
        "speed": 0.1
      },
      "walkLeft": {
        "frames": [4, 7],
        "speed": 0.1
      },
      "attackRight": {
        "frames": [8, 9, 10, 9],
        "speed": 0.1
      },
      "attackLeft": {
        "frames": [12, 13, 14],
        "speed": 0.1
      },
      "headStone": {
        "frames": [11]
      }
    },
    "images": ["images/warrior_sprites5.png"],
    "frames": {
      "height": 127.5,
      "width": 127.5,
      "regX": 0,
      "regY": 0
    }
  });

  this.imgObj = new createjs.Sprite(knightSprites);
  this.imgObj.gotoAndStop("walkRight");
  game.stage.addChild(this.imgObj);

  /** Knight walking
   * @param {number} x - x position of walking point.
   * @param {number} y - y position of walking point.
   * @param {function} walkCallback - callback oafter walking back.
   * @param {boolean} forceFlag - flag of required action.
   */
  this.walk = function(x, y, walkCallback, forceFlag = false) {
    if (actionsFlag && !forceFlag) {
      return false
    };
    actionsFlag++;
    me.direction = (x > me.imgObj.x) + 0;
    me.imgObj.gotoAndPlay(me.dirSettings[me.direction]["walk"]);
    //spawning marker
    game.marker = new marker(x, y);
    game.stage.addChild(game.marker.imgObj);

    //moving
    createjs.Tween.get(me.imgObj)
      .to({ x: x, y: y }, parseInt((Math.abs(x - me.imgObj.x) + Math.abs(y - me.imgObj.y)) / me.skills.movementSpeed), createjs.Ease.getPowInOut(1.5))
      .call(function() {
        if (walkCallback) {
          walkCallback();
        } else {
          me.imgObj.gotoAndStop(me.dirSettings[me.direction]["walk"]);
        };
        game.stage.removeChild(game.marker.bitmap);
        actionsFlag--;
      });
  };

  /** Fighting with monsters.
   * @param {Monster} monster - attacking monster.
   * @param {number} monsterHP - healph points of monster.
   * @param {number} monsterAttack - attack points of monster.
   * @param {function} callback - callback after going.
   */
  this.gotoAndFight = function(coinValue, monster, monsterAttack, callback) {
    if (actionsFlag) {
      return false;
    }
    actionsFlag++;
    var coord = -127.5;
    var attackFrame = "attackRight";
    var walkFrame = "walkRight";
    if (me.imgObj.x > monster.imgObj.x) {
      coord = 127.5;
      attackFrame = "attackLeft";
      walkFrame = "walkLeft";
    };
    me.walk(monster.imgObj.x + coord, monster.imgObj.y, function() {
      //starting animation
      me.imgObj.gotoAndPlay(attackFrame);
      //callback
      setTimeout(function() {
        callback();
        me.imgObj.gotoAndStop(walkFrame);
        //monster.monsterHP = monster.monsterHP - me.skills.attack - me.skills.extraAttack;
        // console.log(monster.monsterHP - me.skills.attack - me.skills.extraAttack)
        me.minusHPKnight(monsterAttack);
        actionsFlag--;
      }, 1000)
    }, true);
  };

  this.die = function() {
    me.imgObj.gotoAndStop("headStone");
  };

  /** Minusing HP of knight
   *  @param {number} monsterAttack - value of attack point
   */
  this.minusHPKnight = function(monsterAttack) {
    me.knightHP = me.knightHP - monsterAttack;
    me.refreshBar(me.knightHP, me.defaultHP, this.hpBar, 20, 50, "#e50707");
  };

  /** Plus HP of knight
   *  @param {number} value - value of plusing hp
   */
  this.plusHPKnight = function(value) {
    me.knightHP = me.knightHP + value;
    me.refreshBar(me.knightHP, me.defaultHP, this.hpBar, 20, 50, "#e50707");
  };

  this.hpBar = new createjs.Shape();
  this.hpBar.graphics.beginFill("#e50707");
  this.hpBar.graphics.drawRect(
    game.stage.canvas.width / 2 - 400,
    20,
    800,
    50
  );
  game.stage.addChild(this.hpBar);

  this.manaBar = new createjs.Shape();
  this.manaBar.graphics.beginFill("#005aff");
  this.manaBar.graphics.drawRect(
    game.stage.canvas.width / 2 - 400,
    70,
    800,
    25
  );
  game.stage.addChild(this.manaBar);

  /** Refreshing of healph bar */
  this.refreshBar = function(count1, count2, bar, y, height, color) {
    if (count1 <= 0) {
      bar.graphics.clear();
      bar.graphics.drawRect(game.stage.canvas.width / 2 - 400, y, 0, height);
    } else {
      // game.stage.removeChild(hpBar);
      factorKnight = parseInt(count1 / count2 * 100) / 100;
      //console.log(factorKnight);
      bar.graphics.clear();
      bar.graphics.beginFill(color);
      bar.graphics.drawRect(game.stage.canvas.width / 2 - 400, y, factorKnight * 800, height);
      //game.stage.addChild(hpBar);
    }
  };

  /** Regenerating */
  this.regen = function(count1, count2, bar, y, height, color) {
    if (count1 < count2) {
      count1 += 1;
      me.refreshBar(count1, count2, bar, y, height, color);
    };
  };

  /** Using ability
   * @param {object} target - target of using ability
   * @param {string} abilityName - name of ability to switch construction 
   */
  this.useAbility = function(abilityName) {
    switch (abilityName) {
      case "heal":
        if (me.knightHP == me.defaultHP || healAbilityFlag) {
          return false
        };
        healAbilityFlag = 1;
        me.manaPoints -= 2;
        me.refreshBar(me.manaPoints, me.defaultMana, me.manaBar, 70, 25, "#005aff");
        if (me.knightHP >= me.defaultHP - 5) {
          me.knightHP = me.defaultHP;
          me.refreshBar(me.knightHP, me.defaultHP, this.hpBar, 20, 50, "#e50707");
        } else {
          me.plusHPKnight(4);
        };
        game.abilityPanel.healSlot.changeImage();
        setTimeout(function() {
          healAbilityFlag = 0;
        }, 5000);
        break;
      case "slam":
        if (slamAbilityFlag) {
          return false;
        }
        slamAbilityFlag = 1;
        me.skills.extraAttack = 2;
        //console.log(me.skills.extraAttack)
        me.manaPoints -= 3;
        me.refreshBar(me.manaPoints, me.defaultMana, me.manaBar, 70, 25, "#005aff");
        game.abilityPanel.slamSlot.changeImage();
        setTimeout(function() {
          slamAbilityFlag = 0;
        }, 4000)
        break;
    }
  }
};

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