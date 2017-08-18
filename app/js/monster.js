   /** Monster function
    * @consructor
    */
   function Monster(standFrames, image, spriteWidth, spriteHeight, x, y, monsterHP, widthBar, heightBar, nameOfMonster, monsterAttackPoint, coinValue, textPosX, levelPointsValue) {
     /** Variables */
     var me = this;
     this.monsterHP = monsterHP;
     var defaultHP = this.monsterHP;
     var targetHP = monsterHP;
     var monsterAttack = monsterAttackPoint;
     var coinValue = coinValue;

     /** Sprites setting */
     var monsterSprites = new createjs.SpriteSheet({
      "animations": {
         "stand": {
           "frames": standFrames,
           "speed": 0.1
         }
       },
       "images": [image],
       "frames": {
         "height": spriteHeight,
         "width": spriteWidth,
         "regX": 0,
         "regY": 0
       }
     });

     /** Adding snake */
     this.imgObj = new createjs.Sprite(monsterSprites);
     game.stage.addChild(this.imgObj);
     this.imgObj.gotoAndPlay("stand");

     /** Moving monster to selected post */
     createjs.Tween.get(this.imgObj)
       .to({ x: x, y: y });

     /** Making variable to hp bar*/
     var hpText = new createjs.Text(nameOfMonster, "20px Arial", "black");

     var monsterhpbar = new createjs.Shape();
     var container = new createjs.Container();
     container.x = x;
     container.y = y - 75;
     hpText.x = hpText.x + textPosX;
     container.addChild(monsterhpbar);
     container.addChild(hpText);

     /** Refreshing healph bar */
     function hpReload() {
       game.stage.removeChild(container);
       factor = parseInt(me.monsterHP / defaultHP * 100) / 100;
       //console.log(factor);
       monsterhpbar.graphics.clear();
       monsterhpbar.graphics.beginFill('#cc0000');
       monsterhpbar.graphics.drawRect(0, 0, factor * widthBar, heightBar);
       game.stage.addChild(container);
     };

     /** Adding listener */
     me.imgObj.addEventListener("click", onMonsterClick);
     /** Function, called by listener */
     function onMonsterClick(ev) {
       hpReload();
       // setTimeout(function(){
       //     game.storage.remove("monsterHP")
       // }, 20000);
       game.knight.gotoAndFight(coinValue, me, monsterAttackPoint, function() {
         //game.storage.setField("monsterHP", monsterHP)
         if (game.storage.getField("equipedWeapon")) {
          me.monsterHP = me.monsterHP - game.knight.skills.extraAttack - game.knight.skills.attack  - game.itemCollection.items[game.storage.getField("equipedWeapon")].attack;
        } else {
          me.monsterHP = me.monsterHP - game.knight.skills.extraAttack - game.knight.skills.attack;
        }
         
         game.knight.skills.extraAttack = 0;
         hpReload();
         if (me.monsterHP <= 0) {
           game.stage.removeChild(me.imgObj);
           game.stage.removeChild(container)
           drop(coinValue);
           game.storage.refresh("levelPoints", game.storage.getField("levelPoints"), levelPointsValue);
           game.equipmentPanel.refresh();
         };
       });
     };

     /** Drop func
      * @param {number} coinValue - value of monster
      */
     function drop(coinValue) {
       var variable;
       variable = parseInt(Math.random() * 6);
       switch (variable) {
         case 0:
           game.inventory.spawnItems("manaPotion", x - spriteWidth / 2 + 60, y + spriteHeight / 2 - 24);
           break;
         case 1:
           game.inventory.spawnItems("speedPotion", x - spriteWidth / 2 + 60, y + spriteHeight / 2 - 24);
           break;
         case 2:
           game.inventory.spawnItems("healphPotion", x - spriteWidth / 2 + 60, y + spriteHeight / 2 - 24);
           break;
         case 3:
           game.inventory.spawnItems("basicSword", x - spriteWidth / 2 + 60, y + spriteHeight / 2 - 24);
           break;
         case 4:
           game.inventory.spawnItems("basicAxe", x - spriteWidth / 2 + 60, y + spriteHeight / 2 - 24);
           break;
         case 5:
           game.inventory.spawnItems("coin", x - spriteWidth / 2 + 60, y + spriteHeight / 2 - 24, coinValue);
           break;
       }
     };
   };

   function Snake(x, y) {
     this.prototype = new Monster(
       [6, 7, 8, 7],
       "images/king_cobra3.png",
       93,
       93.8,
       x,
       y,
       5,
       100,
       50,
       'King cobra',
       1,
       1,
       3,
       1)
   };

   function Harpy(x, y) {
     this.prototype = new Monster(
       [0, 1, 2, 1],
       "images/harpy.png",
       105,
       87,
       x, y,
       10,
       105,
       50,
       'Harpy',
       2,
       2,
       25,
       2)
   };

   function Reaper(x, y) {
     this.prototype = new Monster(
       [0, 1, 2, 1],
       "images/reaper.png",
       140,
       70,
       x, y,
       30, 140,
       50,
       'Reaper',
       10,
       10,
       35,
       10)
   };