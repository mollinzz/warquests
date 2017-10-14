   /** Monster function
    * @consructor
    */
   function Monster(standFrames, image, spriteWidth, spriteHeight, x, y, monsterHP, widthBar, heightBar, nameOfMonster, monsterAttackPoint, coinValue, textPosX, levelPointsValue, monsterName, moveKoeff = 1, distance = 300) {
     /** Variables */
     this.id = game.monsterColl.length;
     this.status = "walk";
     game.monsterColl.push(this);
     var damageDist = 150;
     //  console.log(game.monsterColl)
     var me = this;
     this.monsterHP = monsterHP;
     var defaultHP = this.monsterHP;
     var targetHP = monsterHP;
     var monsterAttack = monsterAttackPoint;
     var coinValue = coinValue;

     this.container = new createjs.Container();
     this.container.x = x;
     this.container.y = y - 75;

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
     this.container.addChild(this.imgObj);
     this.imgObj.gotoAndPlay("stand");

     /** Moving monster to selected post */
     createjs.Tween.get(this.container)
       .to({
         x: x,
         y: y
       });

     /** Making variable to hp bar*/
     var hpText = new createjs.Text(nameOfMonster, "20px Arial", "black");
     var monsterhpbar = new createjs.Shape();

     hpText.x = hpText.x + textPosX;
     hpText.y = -heightBar;

     this.container.addChild(monsterhpbar);
     this.container.addChild(hpText);
     game.stage.addChild(this.container);

     this.checkDistance = function(knightX, knightY) {
       var deltaX = me.container.x - knightX;
       var deltaY = me.container.y - knightY;
       if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(distance, 2)) {
         if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(damageDist, 2)) {
           if (me.status != "fight") {
             // TODO: knight defense
             game.knight.minusHPKnight(monsterAttackPoint);
             me.status = "fight";
             setTimeout(function() {
               me.status = "waitForFight";
             }, 2000);
           }
         } else {
           // following
           me.status = "following";
           createjs.Tween.get(me.container, {override: true})
           .to({x: knightX, y: knightY}, 2000)
         }
       } else if (me.status != "walk") {
         me.status = "walk";
         me.startMove();
       }
     };


     this.startMove = function() {
       var distance = Math.floor(300 * moveKoeff);
       var halfDistance = Math.floor(150 * moveKoeff);
       setTimeout(function() {
         createjs.Tween.get(me.container, {})
           .to({
             x: me.container.x + Math.floor(Math.random() * distance) - halfDistance,
             y: me.container.y
           }, Math.floor(Math.random() * 2000) + 1000)
           .to({
             x: me.container.x + Math.floor(Math.random() * distance) - halfDistance,
             y: me.container.y + Math.floor(Math.random() * distance) - halfDistance
           }, Math.floor(Math.random() * 2000) + 1000)
           .to({
             x: me.container.x,
             y: me.container.y + Math.floor(Math.random() * distance) - halfDistance
           }, Math.floor(Math.random() * 2000) + 1000)
           .to({
             x: me.container.x + Math.floor(Math.random() * 200) - 100,
             y: me.container.y + Math.floor(Math.random() * 200) - 100
           }, Math.floor(Math.random() * 2000) + 1000)
           .call(me.startMove)
       }, Math.floor(Math.random() * 3000));
     };
     this.startMove();
     /** Refreshing healph bar */
     function hpReload() {
       game.stage.removeChild(this.container);
       factor = parseInt(me.monsterHP / defaultHP * 100) / 100;
       //console.log(factor);
       monsterhpbar.graphics.clear();
       monsterhpbar.graphics.beginFill('#cc0000');
       monsterhpbar.graphics.drawRect(0, -heightBar - 10, factor * widthBar, heightBar);
       game.stage.addChild(this.container);
     };

     /** Adding listener */
     me.imgObj.addEventListener("click", onMonsterClick);
     /** Function, called by listener */
     function onMonsterClick(ev) {
       hpReload();
       // setTimeout(function(){
       //     game.storage.remove("monsterHP")
       // }, 20000);

       createjs.Tween.get(me.container, {
           override: true
         })
         .to({
           x: me.container.x,
           y: me.container.y
         }, 10);

       game.knight.gotoAndFight(coinValue, me, monsterAttackPoint, spriteWidth, function() {
         //game.storage.setField("monsterHP", monsterHP)
         if (game.storage.getField("equipedWeapon")) {
           me.monsterHP = me.monsterHP - game.knight.skills.extraAttack - game.knight.skills.attack - game.itemCollection.items[game.storage.getField("equipedWeapon")].attack;
         } else {
           me.monsterHP = me.monsterHP - game.knight.skills.extraAttack - game.knight.skills.attack;
         }

         game.knight.skills.extraAttack = 0;
         hpReload();
         if (me.monsterHP <= 0) {
           setTimeout(function() {
             game.spawner.randomMachine(1, levelSettings[game.currentLevel].monsters[parseInt(Math.random() * levelSettings[game.currentLevel].monsters.length)].name)
           }, 3000);
           game.stage.removeChild(me.container);
           game.monsterColl[me.id] = null;
           drop(coinValue);
           game.storage.refresh("levelPoints", game.storage.getField("levelPoints"), levelPointsValue);
           game.equipmentPanel.refresh();
           game.quests.addProgress(monsterName);
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
       1,
       "snake",
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
       2,
       "harpy",
       1.5,
     )
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
       10,
       "harpy",
       0.5)
   };
