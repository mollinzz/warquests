//monster func
var nice = 0;
function Monster(monsterSprites, standFrames, image,spriteWidth ,spriteHeight , x, y, monsterHP, monsterhpbar,
    widthBar, heightBar, nameOfMonster, monsterAttackPoint){
    var me = this;
    var monsterHP = monsterHP;
    var defaultHP = monsterHP;
    var nice = 0;
    var monsterAttack = monsterAttackPoint;
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
    me.imgObj.addEventListener("click", onMonsterClick);
    function onMonsterClick(ev){
        //alert(nice);
        if (nice) {
            return false;
        }
        nice = 1;
        //console.log(monsterHP);
        hpReload();
        game.knight.gotoAndFight(me, monsterHP, monsterAttackPoint, function(){
            nice = 0;
            monsterHP--;
            hpReload();
            if (!monsterHP) {
                game.stage.removeChild(me.imgObj);
                if (monsterhpbar) {
                    //console.log('Hello');
                    //console.log(monsterhpbar);
                    game.stage.removeChild(monsterhpbar);
                };
                if(hpText) {
                    game.stage.removeChild(hpText);
                };
            // return false
        };
    });
    };
};

function Knight(){
    var me = this, actionFlag = 0, actionFlagFight = 0;
    var knightHP = 15;
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

    // walking
    this.walk = function(x,y, walkCallback){
        if(actionFlag){
            return false;
        };
        actionFlag = 1;
        actionFlagFight = 1;

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
                actionFlag = 1;
                actionFlagFight = 1;  
                setTimeout(function(){
                 actionFlag = 0;
                 actionFlagFight = 0   
             }, 1000)            
            } else {
                me.imgObj.gotoAndStop(me.dirSettings[me.direction]["walk"]);
                actionFlag = 0;
                actionFlagFight = 0;
            };
            game.stage.removeChild(game.marker.imgObj);
        });
    };

    //fighting with monsters
    me.gotoAndFight = function(monster, monsterHP, monsterAttack, callback){
        if (actionFlagFight || actionFlag) {
            return false;
        };
        actionFlagFight = 1;
        if (me.imgObj.x > monster.imgObj.x) {
            me.walk(monster.imgObj.x + 127.5, monster.imgObj.y, function() {
                //starting animation
                me.imgObj.gotoAndPlay("attackLeft");
                //callback
                setTimeout(function(){
                    callback();
                    me.imgObj.gotoAndStop("walkLeft");
                    me.minusHPKnight(monsterAttack);
                },1000)
            });           
        } else {
            me.walk(monster.imgObj.x - 127.5, monster.imgObj.y, function(){
                //starting animation
                me.imgObj.gotoAndPlay("attackRight");

                //callback
                setTimeout(function(){
                    callback();             
                    me.imgObj.gotoAndStop("walkRight");
                    me.minusHPKnight(monsterAttack);
                },1000);
            });
            
        }
    };

    //hpfunctions
    var hpBar = new createjs.Shape();

    me.minusHPKnight = function(monsterAttack){       
        apple = knightHP - monsterAttack;
        knightHP = apple;
        game.stage.removeChild(hpBar);
        factorKnight = parseInt(knightHP / defaultHP * 100) / 100;  
        hpBar.graphics.clear();     
        hpBar.graphics.beginFill('#e50707');
        hpBar.graphics.drawRect(game.stage.canvas.width / 2 - 400, 20, factorKnight * 800, 50);       
        game.stage.addChild(hpBar);
        //console.log(knightHP);
        //console.log(factorKnight);
    };
    hpBar.graphics.beginFill("#e50707");
    hpBar.graphics.drawRect(
        game.stage.canvas.width / 2 - 400, 
        20,
        800,
        50
        );
    game.stage.addChild(hpBar);

    //regenerate
    me.regen = function(){
        if (knightHP < defaultHP) {
            console.log(knightHP);
            knightHP++;
            game.stage.removeChild(hpBar);
            factorKnight = parseInt(knightHP / defaultHP * 100) / 100; 
            console.log(factorKnight);
            hpBar.graphics.clear();     
            hpBar.graphics.beginFill('#e50707');
            hpBar.graphics.drawRect(game.stage.canvas.width / 2 - 400, 20, factorKnight * 800, 50);       
            game.stage.addChild(hpBar);          
        }
    };
};

//decor
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
            objects[0].attack
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
            objects[1].attack
            );
          break;
      }
      return monster;
  }
}

//game func
function Game(stageId){
    // code here.
    var me = this;
    this.stage = new createjs.Stage(stageId);
    me.spawner = new MonsterSpawner();
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

        //creating persons
        bg1.graphics.ef(); // short for endFill()
        me.stage.addChild(bg1);  // Add Child to Stage
        //monsterSprites, standFrames, image, spriteHeight, spriteWidth, x, y, monsterHP, monsterhpbar,
    //widthBar, heightBar

    me.spawner.randomMachine(1, 'snake');
    me.spawner.randomMachine(2, 'harpy');

    me.knight = new Knight();
    setInterval(function(){
        me.knight.regen();
    }, 5000);

    me.stage.update();
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", handleEvent);
    function handleEvent(){
        me.stage.update();               
    }
};
}