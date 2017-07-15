// var target;
/** 
 *monster function
 * @consructor
 */
 function Monster(monsterSprites, standFrames, image,spriteWidth ,spriteHeight , x, y, monsterHP, monsterhpbar,
    widthBar, heightBar, nameOfMonster, monsterAttackPoint, coinValue){
    /** vars*/
    var me = this;
    var monsterHP = monsterHP;
    var defaultHP = monsterHP;
    var targetHP = monsterHP;
    var monsterAttack = monsterAttackPoint;
    var coinValue = coinValue;
    //sprites
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

    //adding snake
    this.imgObj = new createjs.Sprite(monsterSprites);
    game.stage.addChild(this.imgObj);  
    this.imgObj.gotoAndPlay("stand");

    // moving 
    createjs.Tween.get(this.imgObj)
    .to({x:x, y:y});

    //hpbar
    var hpText;
    var monsterhpbar = new createjs.Shape();

    function hpReload(){
        game.stage.removeChild(monsterhpbar);
        factor = parseInt(monsterHP / defaultHP * 100) / 100;
        //console.log(factor);
        monsterhpbar.graphics.clear();
        monsterhpbar.graphics.beginFill('#cc0000');
        monsterhpbar.graphics.drawRect(x, y - 75, factor * widthBar, heightBar);
        game.stage.addChild(monsterhpbar);
    };
    
    //checking click
    setTimeout(function(){
        game.storage.remove("monsterHP")
    }, 20000);
    me.imgObj.addEventListener("click", onMonsterClick);
    function onMonsterClick(ev){
        hpReload();
        // setTimeout(function(){
        //     game.storage.remove("monsterHP")
        // }, 20000);
        game.knight.gotoAndFight(coinValue, me, monsterHP, monsterAttackPoint, function(){
            monsterHP = monsterHP - 3;
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

    function drop(coinValue){
        var variable;
        variable = parseInt(Math.random() * 4);
        switch(variable){
            case 0:
            game.inventory.spawnItems("basicSword", x, y, coinValue);
            break;
            case 1:
            game.inventory.spawnItems("basicAxe", x, y, coinValue);
            break;
            case 2:
            game.inventory.spawnItems("coin", x, y, coinValue);
            break;
            case 3: 
            game.inventory.spawnItems("coin", x, y, coinValue);
            break;
        }
    };
};

/**
 * Main hero
 * @constructor
 */
 function Knight(){
    var actionsFlag = 0;
    var me = this;
    var defaultHP = knightHP;
    var factorKnight;
    var apple;
    this.direction = 1;// right direction
    this.dirSettings = [
    {"walk":"walkLeft"},
    {"walk":"walkRight"}
    ];

    // sprites
    var heroSprites = new createjs.SpriteSheet({
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
    this.imgObj = new createjs.Sprite(heroSprites);
    this.imgObj.gotoAndStop("walkRight");
    game.stage.addChild(this.imgObj);

    /** 
    * Knight walking
    * @param {number} x - x position of walking point
    * @param {number} y - y position of walking point
    * @param {function} walkCallback - callback oafter walking back
    * @param {boolean} forceFlag - flag of required action
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
        .to({ x: x, y: y}, parseInt((Math.abs(x - me.imgObj.x) + Math.abs(y - me.imgObj.y)) / 0.3), createjs.Ease.getPowInOut(1.5))
        .call(function(){
            if (walkCallback){
                walkCallback();     
            } else {
                me.imgObj.gotoAndStop(me.dirSettings[me.direction]["walk"]);
            };
            game.stage.removeChild(game.marker.imgObj);
            actionsFlag--;
        });
    };

    /**
     * Fighting with monsters.
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
        //alert(knightHP)
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

    var hpBar = new createjs.Shape();
    /**
     * Minusing HP of knight
     *  @param {number} monsterAttack - value of attack point
     */
     this.minusHPKnight = function(monsterAttack){       
        knightHP = knightHP - monsterAttack;
        me.refreshHealphBar();
    };
    hpBar.graphics.beginFill("#e50707");
    hpBar.graphics.drawRect(
        game.stage.canvas.width / 2 - 400, 
        20,
        800,
        50
        );
    game.stage.addChild(hpBar);

    this.refreshHealphBar = function(){
        if (knightHP >= defaultHP) {
            return false
        }
        game.stage.removeChild(hpBar);
        factorKnight = parseInt(knightHP / defaultHP * 100) / 100; 
        console.log(factorKnight);
        hpBar.graphics.clear();     
        hpBar.graphics.beginFill('#e50707');
        hpBar.graphics.drawRect(game.stage.canvas.width / 2 - 400, 20, factorKnight * 800, 50);       
        game.stage.addChild(hpBar);
    };
    /**
     * Regenerating
     */
     this.regen = function(){
        if (knightHP < defaultHP) {
            console.log(knightHP);
            knightHP++;
            me.refreshHealphBar();
        }   
    };

    this.useAbility = function(target, abilityName){
        // var abilityFlag = 0;
        // if (abilityFlag) {
        //     return false
        // }
        // abilityFlag = 1;
        // switch(abilityName) {
        //     case "shieldUp": 
        //     if (knightHP >= defaultHP) {
        //         return false
        //     };
        //     if (knightHP + 5 >= defaultHP) {
        //         knightHP = defaultHP;
        //         return false
        //     }
        //     alert(knightHP)
        //     knightHP = knightHP + 5;
        //     abilityFlag = 0;
        // }
    }
};
/**
 * marker for detecting walking point
 * @param {number} x - x position
 * @param {number} y - y position
 */
 function marker(x,y){
    var marker = new createjs.SpriteSheet({
        "images": ["images/marker2.png"],
        "frames": {
            "height": 45,
            "width": 45,
            "regX":0,
            "regY": 0
        }
    });
    this.imgObj = new createjs.Sprite(marker);
    //createjs.Tween.get(this.imgObj);
    createjs.Tween.get(this.imgObj)
    .to({x: x + 22.5, y: y + 22.5});
    game.stage.addChild(this.imgObj);
};
/** 
 *Saving objects to localStorage
 */
 function Storage(){
    var me=this;
    this.object = {};
    this.save = function(){
        var sObj = JSON.stringify(this.object);
        localStorage.setItem("object", sObj);
    };

    this.load = function(){
        me.object = JSON.parse(localStorage.getItem("object"));
        if (me.object==null) {
            me.object={};
        }
    };
    this.load();

    this.setField = function(itemKey, itemVal){
        me.object[itemKey] = itemVal;
        me.save();
    };

    this.getField = function(itemKey){
        return  me.object[itemKey];
    };

    this.refreshCoins = function(itemKey, itemValNew, coinValue){
        localStorage.removeItem(itemKey);
        this.setField(itemKey, itemValNew + coinValue);
    };

    this.remove = function(itemKey){
        localStorage.removeItem(itemKey);
    };
}
/** 
 *Spawner of monsters
 */
 function MonsterSpawner() {
    var me = this;
    var countMonster = 0;
    me.randomMachine = function(number, monsterName) {
        for (var i=1; i<=number; i++) {
            me.createMonster(
                Math.random()*game.stage.canvas.width,
                Math.random()*game.stage.canvas.height,
                monsterName
                );
        }
    }
    me.createMonster = function(x, y, monsterName) {
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
}
function Item(image, x, y, itemName, coinValue){
    var me = this;
    var item = new createjs.SpriteSheet({
        "images": [image],
        "frames": {
            "height": 48,
            "width": 48,
            "regX":0,
            "regY": 0
        }
    });
    this.imgObj = new createjs.Sprite(item);
    createjs.Tween.get(this.imgObj)
    .to({x: x + 24, y: y + 24});
    game.stage.addChild(me.imgObj);
    me.imgObj.addEventListener("click", function(){
        game.inventory.loot(itemName, coinValue, x, y, function(){
            game.stage.removeChild(me.imgObj)
        })
    });
}
/**
 * Items construct
 *  @param {string} image - image of imgObject
 *  @param {number} x - x position
 *  @param {number} y - y position
 */
 function Inventory(){
    var me = this, flagOpen = 0;
    var inventoryBlock = new createjs.Shape();
    //var cointxt =  game.storage.getItem("coins");
    var text = new createjs.Text('0', "40px Arial", "black");

    createjs.Tween.get(text)
    .to({x: 320, y: window.innerHeight - 390});

    var inventoryBlockFraction = new createjs.SpriteSheet({
        "images": ["images/network.png"],
        "frames": {
            "height": 360,
            "width": 360,
            "regX": 0,
            "regY": 0
        }
    });
    inventoryBlockFraction = new createjs.Sprite(inventoryBlockFraction);
    createjs.Tween.get(inventoryBlockFraction)
    .to({x: 20, y: window.innerHeight - 360 });

    inventoryBlock.graphics.beginFill('yellow');
    inventoryBlock.graphics.drawRect(20, window.innerHeight - 400, 360, 400);


    this.spawnItems = function(itemName, x, y, coinValue){
        var item;
        switch(itemName){
            case 'coin': 
            item = new Item("images/coin.png", x, y, itemName, coinValue);
            break;
            case 'basicAxe':
            item = new Item("images/item-axe.png", x, y, itemName, coinValue);
            break;
            case 'basicSword':
            item = new Item("images/item-sword2.png", x, y, itemName, coinValue);
            break;
        }
        return item;
    }

    this.loot = function(itemName, coinValue, x, y, lootCallback){
        if (game.knight.imgObj.x < x) {
            game.knight.walk(x - 100, y, function(){
                choosing();
                lootCallback(); 
                game.knight.imgObj.gotoAndStop("walkRight")
            })
        } else {
            game.knight.walk(x + 100, y, function(){
                choosing();
                lootCallback(); 
                game.knight.imgObj.gotoAndStop("walkLeft")
            })
        }
            function choosing(){
                switch(itemName){
                    case "coin":
                    game.storage.refreshCoins("coins", game.storage.getField("coins"), coinValue);
                };
            };
        }

        /** Open Inv */
        this.open = function(){
        //alert('хе-хе');
        flagOpen = 1; 
        game.stage.addChild(inventoryBlock);
        game.stage.addChild(inventoryBlockFraction);
        game.stage.addChild(text);
        //alert(cointxt)
    };
    /** Close Inv */
    this.close = function(){
        //alert('не хе-хе');
        flagOpen = 0;
        game.stage.removeChild(inventoryBlock);
        game.stage.removeChild(inventoryBlockFraction);
        game.stage.removeChild(text);
    };
    this.toggle = function(){
        if (!flagOpen) {
            me.open();
        } else {
            me.close();
        }
    }
}

/**
 *Main game fucn 
 */
 function Game(stageId){
    // code here.
    var me = this;
    this.stage = new createjs.Stage(stageId);
    me.spawner = new MonsterSpawner();
    this.inventory = new Inventory();
    this.storage = new Storage();
    // this.items = new Items();
    this.start = function(){
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

    me.spawner.createMonster(50 , 100,'snake');
    me.spawner.createMonster(100 , 100,'snake');
    me.spawner.createMonster(100, 50, 'harpy');
    me.knight = new Knight();

    setInterval(function(){
        me.knight.regen();
    }, 5000);
    setInterval(function(){
        if (knightHP <= 0){
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

