 /** Monster function
 * @consructor
 */
 function Monster(monsterSprites, standFrames, image,spriteWidth ,spriteHeight , x, y, monsterHP, monsterhpbar,
 	widthBar, heightBar, nameOfMonster, monsterAttackPoint, coinValue){
 	/** Variables */
 	var me = this;
 	var monsterHP = monsterHP;
 	var defaultHP = monsterHP;
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
 		"frames":{
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
 	.to({x:x, y:y});

 	/** Makinh variable to hp bar*/
 	var hpText;
 	var monsterhpbar = new createjs.Shape();

 	/** Refreshing healph bar */
 	function hpReload(){
 		game.stage.removeChild(monsterhpbar);
 		factor = parseInt(monsterHP / defaultHP * 100) / 100;
        //console.log(factor);
        monsterhpbar.graphics.clear();
        monsterhpbar.graphics.beginFill('#cc0000');
        monsterhpbar.graphics.drawRect(x, y - 75, factor * widthBar, heightBar);
        game.stage.addChild(monsterhpbar);
      };

      /** Adding listener */
      me.imgObj.addEventListener("click", onMonsterClick);
      /** Function, called by listener */
      function onMonsterClick(ev){
      	hpReload();
        // setTimeout(function(){
        //     game.storage.remove("monsterHP")
        // }, 20000);
        game.knight.gotoAndFight(coinValue, me, monsterHP, monsterAttackPoint, function(){
        	monsterHP = monsterHP - game.knight.skills.attack;
            //game.storage.setField("monsterHP", monsterHP)
            hpReload();
            if (monsterHP<=0) {
            	game.stage.removeChild(me.imgObj);
            	if (monsterhpbar) {
            		game.stage.removeChild(monsterhpbar);
            	};
            	if(hpText) {
            		game.stage.removeChild(hpText);
            	};
            	drop(coinValue);
            };
          });
      };

    /** Drop func
     * @param {number} coinValue - value of monster
     */
     function drop(coinValue){
     	var variable;
     	variable = parseInt(Math.random() * 6);
     	switch(variable){
     		case 0: game.inventory.spawnItems("attackPointPotion", x, y);
     		break;
     		case 1: 
     		game.inventory.spawnItems("speedPotion", x, y);
     		break;
     		case 2:
     		game.inventory.spawnItems("healphPotion", x, y);
     		break;
     		case 3:
     		game.inventory.spawnItems("basicSword", x, y, coinValue);
     		break;
     		case 4:
     		game.inventory.spawnItems("basicAxe", x, y, coinValue);
     		break;
     		case 5:
     		game.inventory.spawnItems("coin", x, y, coinValue);
     		break;
     	}
     };
   };
   function Snake(x, y){
   	this.prototype = new Monster(
   		"snakeSprites",
   		[6,7,8,7],
   		"images/king_cobra3.png",
   		93,
   		93.8,
   		x,
   		y,
   		5,
   		'bar',
   		100,
   		50,
   		'King cobra',
   		1,
   		1)
   };
   function Harpy (x, y){
   	this.prototype = new Monster(
   		"harpySprites",
   		[0,1,2,1],
   		"images/harpy.png",
   		105,
   		87,
   		x, y,
   		10,
   		'bar',
   		70,
   		15,
   		'Gotic harpy',
   		2,
   		2)
   };