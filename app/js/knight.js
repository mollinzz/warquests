 /** Main hero
  * @constructor
  */
 function Knight() {
   var me = this;
   var attackSpeed;
   var healAbilityFlag = 0;
   var slamAbilityFlag = 0;
   this.actionsFlag = 0;
   this.knightHP = 15;
   this.defaultHP = this.knightHP;
   this.manaPoints = 10;
   this.defaultMana = this.manaPoints;
   this.skills = {
     shieldBlock: 1,
     movementSpeed: 0.3,
     extraAttack: 0,
     attack: 1,
   };

   this.containerBar = new createjs.Container();
   game.stage.addChild(this.containerBar);
   this.containerBar.addEventListener("click", function() {
     return false
   });

   this.direction = 1; // right direction
   this.dirSettings = [{
       "walk": "walkLeft"
     },
     {
       "walk": "walkRight"
     },
   ];

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

   this.weaponObj = null;

   this.container = new createjs.Container();
   game.stage.addChild(this.container);

   this.imgObj = new createjs.Sprite(knightSprites);
   this.imgObj.gotoAndStop("walkRight");
   this.container.addChild(this.imgObj);

   this.checkPath = function(x1, y1, x2, y2) {
     console.log("x1: " + x1);
     console.log("y1: " + y1);
     console.log("x2: " + x2);
     console.log("y2: " + y2);
     var bound, currentChild;

     for (var i = 0; i < game.stage.children.length; i++) {
       currentChild = game.stage.children[i];
       bound = game.stage.children[i].getBounds();
       if (bound) {
         //  console.log("x3:" + parseInt(currentChild.x));
         //  console.log("x4:" + parseInt(currentChild.x + bound.width));
         //  console.log("y3:" + parseInt(currentChild.y));
         pointX = me.getPoint(x1, y1, x2, y2, parseInt(currentChild.x), parseInt(currentChild.y), parseInt(currentChild.x + bound.width))
         if (pointX) {
           console.log("pointX: " + pointX);
         };
         //indexArray.push(Math.floor(game.stage.children[i].y + bound.height));
       };
     };
   };

   this.calculateKoeffs = function(x1, y1, x2, y2) {
     var k = null;
     var b = null;

     k = (y2 - y1) / (x2 - x1);
     b = k * x1 - y1;

     var returnObj = {
       k: k,
       b: b
     };
     return returnObj;
   };

   this.getPoint = function(x1, y1, x2, y2, x3, y3, x4) {
     var koeffs = me.calculateKoeffs(x1, y1, x2, y2);
     var x5 = (y3 - koeffs.b) / koeffs.k;
     if (x5 <= x3) {
       return false
     }
     if (x5 >= x4) {
       return false
     }
     return x5;
   };

   /** Knight walking
    * @param {number} x - x position of walking point.
    * @param {number} y - y position of walking point.
    * @param {function} walkCallback - callback oafter walking back.
    * @param {boolean} forceFlag - flag of required action.
    */
   this.walk = function(x, y, walkCallback, forceFlag = false) {
     //  if (me.actionsFlag && !forceFlag) {
     //    return false
     //  };
     debugger;
     createjs.Tween.removeTweens(me.container)
     if (game.marker) {
       game.stage.removeChild(game.marker.bitmap);
     }
     me.checkPath(parseInt(me.container.x), parseInt(me.container.y), parseInt(x), parseInt(y))
     //  me.actionsFlag++;
     me.direction = (x > me.container.x) + 0;
     me.weaponObj.gotoAndStop(me.dirSettings[me.direction]["walk"]);
     me.imgObj.gotoAndPlay(me.dirSettings[me.direction]["walk"]);
     //spawning marker
     game.marker = new marker(x, y);
     game.stage.addChild(game.marker.bitmap);
     setTimeout(function() {
       createjs.Tween.get(me.container, {
         paused: true
       })
     }, 1000)
     //moving
     createjs.Tween.get(me.container)
       .to({
         x: x,
         y: y
       }, parseInt((Math.abs(x - me.container.x) + Math.abs(y - me.container.y)) / me.skills.movementSpeed), createjs.Ease.getPowInOut(1))
       .call(function() {
         if (walkCallback) {
           walkCallback();
         } else {
           me.imgObj.gotoAndStop(me.dirSettings[me.direction]["walk"]);
           me.weaponObj.y = 15;
           me.weaponObj.x = 10;
         };
         game.stage.removeChild(game.marker.bitmap);
         //  me.actionsFlag--;
       });
   };

   /** Fighting with monsters.
    * @param {Monster} monster - attacking monster.
    * @param {number} monsterHP - healph points of monster.
    * @param {number} monsterAttack - attack points of monster.
    * @param {function} callback - callback after going.
    */
   this.gotoAndFight = function(coinValue, monster, monsterAttack, monsterWidth, callback) {
     if (game.itemCollection.items[game.storage.getField("equipedWeapon")]) {
       attackSpeed = game.itemCollection.items[game.storage.getField("equipedWeapon")].attackSpeed;
     } else {
       attackSpeed = 1000;
     }
     var coordX = -127.5;
     var coordY = 0;
     var attackFrame = "attackRight";
     var walkFrame = "walkRight";
     if (me.container.x > monster.imgObj.x) {
       coordX = 127.5;
       attackFrame = "attackLeft";
       walkFrame = "walkLeft";
     };
     if (monster.imgObj.x - 70 < me.container.x & me.container.x < monster.imgObj.x + monsterWidth - 10) {
       coordX = 0;
       if (monster.imgObj.y + 20 < me.container.y) {
         coordY = 127.5;
       } else {
         coordY = -127.5;
       }
     };
     me.walk(monster.imgObj.x + coordX, monster.imgObj.y + coordY, function() {
       if (me.actionsFlag) {
         console.log("string")
         return false;
       };
       me.actionsFlag++;
       //starting animation
       me.imgObj.gotoAndPlay(attackFrame);
       me.weaponObj.gotoAndPlay(attackFrame);
       createjs.Sound.play('hit');
       //callback
       setTimeout(function() {
         callback();
         me.imgObj.gotoAndStop(walkFrame);
         me.weaponObj.gotoAndStop(walkFrame);
         me.minusHPKnight(monsterAttack);
         me.actionsFlag--;
       }, attackSpeed)
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
   this.manaBar = new createjs.Shape();
   this.manaBar.graphics.beginFill("#005aff");
   this.manaBar.graphics.drawRect(
     game.stage.canvas.width / 2 - 400,
     70,
     800,
     25
   );
   this.containerBar.addChild(this.manaBar);

   this.hpBar = new createjs.Shape();
   this.hpBar.graphics.beginFill("#e50707");
   this.hpBar.graphics.drawRect(
     game.stage.canvas.width / 2 - 400,
     20,
     800,
     50
   );
   this.containerBar.addChild(this.hpBar);

   // this.hpBar.prototype = new Bar(game.stage.canvas.width / 2 - 400, 20, 800, 50, "#e50707", this.containerBar)
   // this.manaBar = new Bar(game.stage.canvas.width / 2 - 400, 70, 800, 25, "#005aff", this.containerBar)

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

   var factor;
   var factor2;
   setInterval(function() {
     factor = Math.random() * 3000;
     setTimeout(function() {
       me.regen(me.knightHP, me.defaultHP, me.hpBar, 20, 50, "#e50707");
     }, factor);
   }, 5000);

   setInterval(function() {
     factor2 = Math.random() * 5000;
     setTimeout(function() {
       // alert(me.knight.regen)
       me.regen(me.manaPoints, me.defaultMana, me.manaBar, 70, 25, "#005aff");
     }, factor2);
   }, 6000);

   setInterval(function() {
     if (me.knightHP <= 0) {
       me.die();
       setTimeout(function() {
         location.reload();
       }, 1000)
     }
   }, 100)

   this.refreshBar = function(count1, count2, bar, y, height, color) {
     if (count1 <= 0) {
       bar.graphics.clear();
       bar.graphics.drawRect(game.stage.canvas.width / 2 - 400, y, 0, height);
     } else {
       // game.stage.removeChild(hpBar);
       factorKnight = parseInt(count1 / count2 * 100) / 100;
       //console.log(bar);
       bar.graphics.clear();
       bar.graphics.beginFill(color);
       bar.graphics.drawRect(game.stage.canvas.width / 2 - 400, y, factorKnight * 800, height);
       //game.stage.addChild(hpBar);
     }
   };

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
           me.refreshBar(me.knightHP, me.defaultHP, me.hpBar, 20, 50, "#e50707");
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
 6