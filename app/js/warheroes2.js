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

/** Main hero
 * @constructor
 */
 function Knight(){
 	this.knightHP = 15;
 	var actionsFlag = 0;
 	var me = this;
 	this.defaultHP = this.knightHP;
 	var factorKnight;
 	var apple;
	 this.direction = 1;// right direction
	 this.dirSettings = [
	 {"walk":"walkLeft"},
	 {"walk":"walkRight"}
	 ];
	 this.skills = {
	 	shieldBlock: 1,
	 	slam: 2,
	 	movementSpeed: 0.3,
	 	attack: 10,
	 	manaPoints: 10
	 };

	/** Sprites setting */
	 var knightSprites = new createjs.SpriteSheet({
	 	"animations" : {
	 		"walkRight": {
	 			"frames": [0,3],
	 			"speed": 0.1
	 		},
	 		"walkLeft": {
	 			"frames": [4,7],
	 			"speed": 0.1
	 		},
	 		"attackRight": {
	 			"frames":[8,9,10,9],
	 			"speed": 0.1
	 		},
	 		"attackLeft": {
	 			"frames": [12,13,14],
	 			"speed": 0.1
	 		}
	 	},
	 	"images" : ["images/warrior_sprites4.png"],
	 	"frames" : {
	 		"height": 127.5,
	 		"width" : 127.5,
	 		"regX" : 0,
	 		"regY" : 0
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
     this.walk = function(x,y, walkCallback, forceFlag = false){
     	if (actionsFlag && !forceFlag) {
     		return false
     	};
     	actionsFlag++;
     	me.direction = (x > me.imgObj.x)+0;
     	me.imgObj.gotoAndPlay(me.dirSettings[me.direction]["walk"]);
        //spawning marker
        game.marker = new marker(x,y);
        game.stage.addChild(game.marker.imgObj);

        //moving
        createjs.Tween.get(me.imgObj)
        .to({ x: x, y: y}, parseInt((Math.abs(x - me.imgObj.x) + Math.abs(y - me.imgObj.y)) / me.skills.movementSpeed), createjs.Ease.getPowInOut(1.5))
        .call(function(){
        	if (walkCallback){
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
     this.gotoAndFight = function(coinValue, monster, monsterHP, monsterAttack, callback){
     	if (actionsFlag) {
     		return false;
     	}
     	actionsFlag++;
     	target = monster;
     	if (me.imgObj.x > monster.imgObj.x) {
     		me.walk(monster.imgObj.x + 127.5, monster.imgObj.y, function() {
	        //starting animation
	        me.imgObj.gotoAndPlay("attackLeft");
	        //callback
	        setTimeout(function(){
	        	callback();
	        	me.imgObj.gotoAndStop("walkLeft");
	        	me.minusHPKnight(monsterAttack);
	        	actionsFlag--;
	        },1000)
	      }, true);           
     	} else {
     		me.walk(monster.imgObj.x - 127.5, monster.imgObj.y, function(){
                //starting animation
                me.imgObj.gotoAndPlay("attackRight");

                //callback
                setTimeout(function(){
                	callback();                            
                	me.imgObj.gotoAndStop("walkRight");
                	me.minusHPKnight(monsterAttack);
                	actionsFlag--;   
                },1000);
              }, true);

     	}
     };

    /** Minusing HP of knight
     *  @param {number} monsterAttack - value of attack point
     */
     this.minusHPKnight = function(monsterAttack){       
     	me.knightHP = me.knightHP - monsterAttack;
     	me.refreshBar(me.knightHP, me.defaultHP, hpBar, 20, 50);
     };

    /** Plus HP of knight
     *  @param {number} value - value of plusing hp
     */
     this.plusHPKnight = function(value){       
     	me.knightHP = me.knightHP + value;
     	me.refreshBar(me.knightHP, me.defaultHP, hpBar, 20, 50);
     };

     var hpBar = new createjs.Shape();
     hpBar.graphics.beginFill("#e50707");
     hpBar.graphics.drawRect(
     	game.stage.canvas.width / 2 - 400, 
     	20,
     	800,
     	50
     	);
     game.stage.addChild(hpBar);

     var manaBar = new createjs.Shape();
     manaBar.graphics.beginFill("#005aff");
     manaBar.graphics.drawRect(
     	game.stage.canvas.width / 2 - 400, 
     	70,
     	800,
     	25
     	);
     game.stage.addChild(manaBar);

     /** Refreshing of healph bar */
     this.refreshBar = function(count1, count2, bar, y, width){
        // game.stage.removeChild(hpBar);
        factorKnight = parseInt(count1 / count2 * 100) / 100; 
        //console.log(factorKnight);
        bar.graphics.clear();     
        bar.graphics.beginFill('#e50707');
        bar.graphics.drawRect(game.stage.canvas.width / 2 - 400, y, factorKnight * 800, width);       
        //game.stage.addChild(hpBar);
      };

      /** Regenerating */
      this.regen = function(){
      	if (me.knightHP < me.defaultHP) {
      		console.log(me.knightHP);
      		me.plusHPKnight(1);
      		me.refreshBar(me.knightHP, me.defaultHP, hpBar, 20, 50);
      	}   
      };

    /** Using ability
     * @param {object} target - target of using ability
     * @param {string} abilityName - name of ability to switch construction 
     */
     this.useAbility = function(target, abilityName){
     	var abilityFlag = 0;
     	if (abilityFlag) {
     		return false
     	}
     	abilityFlag = 1;
     	switch(abilityName) {
     		case "shieldUp": 
     		if (knightHP >= me.defaultHP) {
     			return false
     		};
     		if (knightHP + 5 >= me.defaultHP) {
     			knightHP = defaultHP;
     			return false
     		}
           knightHP = knightHP + 5;
           abilityFlag = 0;
         }
       }
     };

/** marker for detecting walking point
 * @param {number} x - x position
 * @param {number} y - y position
 */
 function marker(x,y){
 		this.bitmap = new createjs.Bitmap("images/marker2.png");
 		this.bitmap.x = x + 22.5;
 		this.bitmap.y = y + 22.5;
    game.stage.addChild(this.bitmap);
 };

/** Saving objects to localStorage */
 function Storage(){
  	var me=this;
  	this.object = {};
  	/** Saving */
  	this.save = function(){
  		var sObj = JSON.stringify(this.object);
  		localStorage.setItem("object", sObj);
  	};

  	/** Loading */
  	this.load = function(){
  		me.object = JSON.parse(localStorage.getItem("object"));
  		if (me.object==null) {
  			me.object={};
  		}
  	};
  	this.load();

  	/** Adding it to loacal storage */
  	this.setField = function(itemKey, itemVal){
  		me.object[itemKey] = itemVal;
  		me.save();
  	};

  	/** Getting from loacal storage */
  	this.getField = function(itemKey){
  		return  me.object[itemKey];
  	};

  	/* Refreshing coins*/
  	this.refreshCoins = function(itemKey, itemValOld, coinValue){
  		if (!itemValOld) {
  			itemValOld = 0;
  		}
  		localStorage.removeItem(itemKey);
  		this.setField(itemKey, itemValOld + coinValue);
  	};

  	/** Refreshing items */
  	this.refreshItem  = function(itemKey, itemValOld, coinValue){
  		if (!itemValOld) {
  			itemValOld = 0;
  		}
        // localStorage.removeItem(itemKey);
        this.setField(itemKey, itemValOld + coinValue);
      };

      /** Removing from local storage */
      this.remove = function(itemKey){
      	localStorage.removeItem(itemKey);
      };
    };

    /** Spawner of monsters */
    function MonsterSpawner() {
    	var me = this;
    	var countMonster = 0;

    /** Spawning monster with random
		 * @param {number} number - number of spawning monsters
		 * @param {string} monsterName - name of monster
		 */
		  this.randomMachine = function(number, monsterName) {
		  	for (var i=1; i<=number; i++) {
		  		me.createMonster(
		  			Math.random()*game.stage.canvas.width,
		  			Math.random()*game.stage.canvas.height,
		  			monsterName
		  			);
		  	}
		  };

    /** Spawning monsters 
		 * @param {number} x - x pos
		 * @param {number} y - y pos
		 * @param {string} monsterName - name of monster to switch constructor
		 */
			this.createMonster = function(x, y, monsterName) {
				countMonster++;
				var monster;
				switch(monsterName) {
					case 'snake':
					monster = new Monster(
						"snakeSprites",
						[6,7,8,7],
						"images/king_cobra3.png",
						93,
						93.8,
						x,
						y,
						objects[0].hp,
						'bar',
						100,
						50,
						'King cobra',
						objects[0].attack,
						1
						);
					break;
					case 'harpy':
					monster = new Monster(
						"harpySprites",
						[0,1,2,1],
						"images/harpy.png",
						105,
						87,
						x, y,
						objects[1].hp,
						'bar',
						70,
						15,
						'Gotic harpy',
						objects[1].attack,
						2
						);
					break;
				}
				return monster;
			}
		};

/** Collection of possible items */
		 function ItemCollection(){
			var me = this;
			this.items = {
				basicSword: {
					"image48": "images/sword48px.png",
					"image100": "images/sword100px.png",
					"effect": function(){

					}
				},
				basicAxe: {
					"image48": "images/axe48px.png",
					"image100": "images/axe100px.png",
					"effect": function(){

					}
				},
				coin: {
					"image48": "images/coin.png",
            "image100": "images/coin.png", //not used
            "effect": function(){

            }
          },
        speedPotion: {
          	"image48": "images/speedPotion48px.png",
          	"image100": "images/speedPotion100px.png",
          	"effect": function(){
          		game.knight.skills.movementSpeed += 3;
          		setTimeout(function(){
          			game.knight.skills.movementSpeed -= 3;
          		}, 5000)  
          	}
          },
          healphPotion: {
          	"image48": "images/healphPotion48px.png",
          	"image100": "images/healphPotion100px.png",
          	"effect": function(){
          		if (game.knight.knightHP >= game.knight.defaultHP - 5) {
          			game.knight.knightHP =  game.knight.defaultHP;
          		} else {
          			game.knight.plusHPKnight(5);
          		};
          		game.knight.refreshHealphBar();
          	}
          },
          attackPointPotion: {
          	"image48": "images/attackpotion48px.png",
          	"image100": "images/attackpotion100px.png",
          	"effect": function(){
          		if (game.knight.knightHP <= 5 ) {
          			game.knight.skills.attack = game.knight.skills.attack + 5;
          			setTimeout(function(){
          				game.knight.skills.attack = game.knight.skills.attack - 5;
          		  }, 5000)
          		} else {
          			game.knight.skills.attack = game.knight.skills.attack + 3;
          		  setTimeout(function(){
          			  game.knight.skills.attack = game.knight.skills.attack - 3;
          		  }, 5000)
          		}
						}
          }
        }

     /** Getting 48px image
     * @param {string} itemName - identificator of item
     */
     this.getSmallImage = function(itemName){
     	return me.items[itemName]["image48"];
     };

     /** Getting 48px image
     * @param {string} itemName - identificator of item
     */
     this.getBigImage = function(itemName){
    	return me.items[itemName]["image100"]
     };
}

/** Game inventory */
 function Inventory(){
  	this.container = new createjs.Container();
  	var me = this, flagOpen = 0;
  	this.slots = [
	  	{"posX": 10, "posY": 60}, 
	  	{"posX": 130, "posY": 60},
	  	{"posX": 250, "posY": 60},
	  	{"posX": 10, "posY": 180},
	  	{"posX": 130, "posY": 180},
	  	{"posX": 250, "posY": 180},
	  	{"posX": 10, "posY": 300},
	  	{"posX": 130, "posY": 300},
	  	{"posX": 250, "posY": 300}
  	];
  	this.itemArray = [
	  	"basicSword",
	  	"basicAxe",
	  	"speedPotion",
	  	"healphPotion",
	  	"attackPointPotion"
  	];

  	this.containerBitmaps = [];

  	var text = new createjs.Text("X " + game.storage.getField("coins"), "40px Arial", "black");
  	text.x = 58;

  	var inventoryBlockFraction = new Image();
  	inventoryBlockFraction.src = "images/network.png";
  	var bitmap = new createjs.Bitmap(inventoryBlockFraction);
  	bitmap.y = 40;

  	var coinImageInv = new Image();
  	coinImageInv.src = "images/coin.png";
  	var bitmap2 = new createjs.Bitmap(coinImageInv);

  	var inventoryBlock = new createjs.Shape();
  	inventoryBlock.graphics.beginFill('yellow');
  	inventoryBlock.graphics.drawRect(0, 0, 360, 400);

  	this.container.x = 20;
  	this.container.y = window.innerHeight - 400;

    //this.container.addChild(inventoryBlock);
    this.container.addChild(bitmap);
    this.container.addChild(text);
    this.container.addChild(bitmap2);

    /** Spawn item into stage */
    this.spawnItems = function(itemName, x, y, coinValue){
    	return new me.item(game.itemCollection.getSmallImage(itemName), x, y, itemName, coinValue);
    };  

    /** Show looted item to inv
      * @param {string} image - adress of img
      * @param {number} x - x pos
      * @param {number} y - y pos
      */
      this.itemInventory = function(image, x, y){
      	var item = new Image();
      	item.src = image;
      	var itemInventoryBitmap = new createjs.Bitmap(item);
      	itemInventoryBitmap.x = x;
      	itemInventoryBitmap.y = y;
      	me.container.addChild(itemInventoryBitmap);
      	me.containerBitmaps.push(itemInventoryBitmap);
      };

    /** Items construct
      *  @param {string} image - image of imgObject
      *  @param {number} x - x position
      *  @param {number} y - y position
      */
      this.item = function (image, x, y, itemName, coinValue){
	     	var bitmapItem = new createjs.Bitmap(image);
	     	bitmapItem.x = x;
	     	bitmapItem.y = y;
	     	game.stage.addChild(bitmapItem);
	     	bitmapItem.addEventListener("click", function(){
	     		me.loot(itemName, coinValue, x, y, function(){
	     			game.stage.removeChild(bitmapItem);
	     		})
	     	});
      };

    /** Loot function for items
      * @param {string} itemName - name of droped item
      * @param {number} coinValue - value of monster in coins
      * @param {number} x - x pos
      * @param {number} y - y pos
      * @param {function} lootCallback - callback function
      */
      this.loot = function(itemName, coinValue, x, y, lootCallback){
      	if (game.knight.imgObj.x < x) {
      		game.knight.walk(x - 100, y, function(){
      			game.knight.imgObj.gotoAndStop("walkRight")
      			choosing();
      			lootCallback(); 
      		})
      	} else {
      		game.knight.walk(x + 100, y, function(){
      			game.knight.imgObj.gotoAndStop("walkLeft")
      			choosing();
      			lootCallback(); 
      		})
      	};
        /**
         * Saving items info into localStorage and refreshing inventory
         */
         function choosing(){
         	switch(itemName){
         		case "coin":
         		game.storage.refreshCoins("coins", game.storage.getField("coins"), coinValue); 
         		break;
         		case "basicSword":
         		case "speedPotion":
         		case "basicAxe":
         		case "healphPotion":
         		case "attackPointPotion":
         		game.storage.refreshItem(itemName, game.storage.getField(itemName), 1);
         		break;
         	}; 
         	me.refresh();
         };
       };

       /** Reloading view inventory */
       this.refresh = function(){
       	var slotIndex = 0;
       	var currentItem = null;
       	for (var i = 0; i < me.containerBitmaps.length; i++) {
       		me.container.removeChild(me.containerBitmaps[i]);
       	};
       	me.containerBitmaps = [];
       	text.text = "X " + game.storage.getField("coins");
       	for (var i = 0; i < me.itemArray.length; i++) {
       		currentItem = game.storage.getField(me.itemArray[i]);
       		if (currentItem) {
       			me.itemInventory(game.itemCollection.getBigImage(me.itemArray[i]),
       				me.slots[slotIndex].posX,
       				me.slots[slotIndex].posY
       				);
       			slotIndex++;
       		};
       	};
       };

       me.refresh();

       /** OpenInv */
       this.open = function(){
       	flagOpen = 1; 
       	game.stage.addChild(me.container)
       };

       /** Close Inv */
       this.close = function(){
       	flagOpen = 0;
       	game.stage.removeChild(me.container);
       };

       /** Toggle function (on key down B) */
       this.toggle = function(){
       	if (!flagOpen) {
       		me.open();
       	} else {
       		me.close();
       	}
       };

    /** Slot apply
      * @todo Refactor
      */
      this.applySlot = function(number) {
      	var slotIndex = 0;
      	var currentItem = null;
      	for (var i = 0; i < me.itemArray.length; i++) {
      		currentItem = game.storage.getField(me.itemArray[i]);
      		if (currentItem) {
      			slotIndex++;
      			if (slotIndex == number){
      				game.storage.refreshItem(me.itemArray[i], game.storage.getField(me.itemArray[i]), -1);
      				me.refresh();                    
      				game.itemCollection.items[me.itemArray[i]].effect();
      				break;
      			};
      		};
      	};
      };
 };

/** Main game func */
 function Game(stageId){
	// code here.
	var me = this;
	this.storage = new Storage();
	this.stage = new createjs.Stage(stageId);
	me.spawner = new MonsterSpawner();
	// this.items = new Items();
	this.itemCollection = new ItemCollection();
	this.start = function(){
	this.inventory = new Inventory();
	// fullscreen canvas
	//window.addEventListener('resize', me.resizeCanvas, false);
	me.resizeCanvas = function() {
	me.stage.canvas.width = window.innerWidth;
	me.stage.canvas.height = window.innerHeight;
	};
	me.resizeCanvas();

	// canvas background
	var bg1 = new createjs.Shape();
	bg1.graphics.beginFill("#51d977"); // first bg
	bg1.graphics.drawRect(
	0,                    // x position
	0,                    // y position
	me.stage.canvas.width,   // width of shape (in px)
	me.stage.canvas.height   // height of shape (in px)
	);
	// Can only define this after shape is drawn, else no fill applies

	bg1.graphics.ef(); // short for endFill()
	me.stage.addChild(bg1);  // Add Child to Stage
	//monsterSprites, standFrames, image, spriteHeight, spriteWidth, x, y, monsterHP, monsterhpbar,
	//widthBar, heightBar

  /** Spawning monsters at start of game */
	me.spawner.createMonster(50 , 100,'snake');
	me.spawner.createMonster(100 , 100,'snake');
	me.spawner.createMonster(150 , 100,'snake');
	me.spawner.createMonster(200 , 100,'snake');
	me.spawner.createMonster(250 , 100,'snake');
	me.spawner.createMonster(300 , 100,'snake');
	me.spawner.createMonster(350 , 100,'snake');

	me.spawner.createMonster(100, 50, 'harpy');
	me.knight = new Knight();

	// setInterval(function(){
	// 	me.knight.regen();
	// }, 5000);

	setInterval(function(){
		if (me.knightHP <= 0){
			alert('gg');
		}
	},100)

	me.stage.update();
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", handleEvent);
	function handleEvent(){
	me.stage.update();               
	}
	};
}