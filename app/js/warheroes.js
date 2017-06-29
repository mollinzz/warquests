function Snake(x,y){
    var me = this;
    var snakeHP = objects[1].hp;
    var defaultSnakeHP = objects[1].hp;
    snakebar = new spawnHPbar(me, x, y - 20, 63, 15);
    //спрайты
    var snakeSprites = new createjs.SpriteSheet({
        "animations": {
            "walkRight":{
                "frames":[3,4,5],
                "speed": 0.1
            },
            "walkLeft":{
                "frames": [9,10,11],
                "speed": 0.1
            },
            "stand":{
                "frames": [6,7,8,7],
                "speed": 0.1
            }   ,
            "wounding":{
                "frames":[6,7,8],
                "speed": 0.1
            }
        },
        "images":["images/king_cobra.png"],
        "frames":{
            "height": 63,
            "width": 63,
            "regX": 0,
            "regY": 0
        }
    });
    //me.snakebar.graphics.beginFill("red")
    //добавление змеи на сцену
    this.imgObj = new createjs.Sprite(snakeSprites);
    game.stage.addChild(this.imgObj);   
    this.imgObj.gotoAndPlay("stand");

    // moving 
    createjs.Tween.get(this.imgObj)
    .to({x:x, y:y});

    // hp bar 
    
    // var squareHP = new createjs.Shape();
    // //ХП шкала
    // squareHP.graphics.beginFill("green");    if (monsterHP == defaultHP * 0.8) {

    // squareHP.graphics.drawRect(
    //           x,                // x position
    //           y - 20,           // y position
    //           63,   // width of shape (in px)
    //           15   // height of shape (in px)
    //           );
    // //squareHP.graphics.ef();
    // game.stage.addChild(squareHP);   

    // //отслеживание клика на змею
    me.imgObj.addEventListener("click", onSnakeClick);
    function onSnakeClick(ev){
        snakeHP--;
        game.knight.gotoAndFight(me, snakeHP, defaultSnakeHP, snakebar);
    };
    // me.minusHP = function(){
    //     snakeHP--;
    //     if (snakeHP == 2) {
    //         squareHP.graphics.clear();
    //         squareHP.graphics.beginFill("orange");
    //         squareHP.graphics.drawRect(
    //             x,
    //             y - 20,
    //             42,
    //             15)
    //     };
    //     if (snakeHP == 1) {
    //         squareHP.graphics.clear();
    //         squareHP.graphics.beginFill("red");
    //         squareHP.graphics.drawRect(
    //             x,
    //             y - 20,
    //             21,
    //             15)
    //     }; 
    //     if (snakeHP == 0) {
    //         game.stage.removeChild(me);
    //         game.stage.removeChild(squareHP);
    //     };
    // }
}           
function Harpy(x,y){
    var me = this;
    var harpyHP = objects[2].hp;
    var defaultHarpyHP = objects[2].hp;
    var harpybar = new spawnHPbar(me, 'harpybar', x, y - 13, 70, 15);

    //sprites
    var harpySprites = new createjs.SpriteSheet({
        "animations": {
            "stand": {
                "frames": [0,1,2,1],
                "speed": 0.1
            },
            "walkRight": {
                "frames": [3,4,5,4],
                "speed": 0.1
            }
        },
        "images": ["images/gjEmld8.png"],
        "frames": {
            "height": 58,
            "width": 70,
            "regX": 0,
            "regY":0
        }
    });
    this.imgObj = new createjs.Sprite(harpySprites);
    game.stage.addChild(this.imgObj);
    this.imgObj.gotoAndPlay("stand");

    //moving
    createjs.Tween.get(this.imgObj)
    .to({x: x, y: y});

    //hpbar
    

    //отслеживание клика
    this.imgObj.addEventListener("click", onHarpyClick);
    function onHarpyClick(){
        harpyHP--;
        game.knight.gotoAndFight(me.imgObj, harpyHP, defaultHarpyHP, 'harpybar');
    }
};
function Knight(){
    var me = this, actionFlag = 0, knightHP = objects[0].hp, actionFlagFight = 0;
    this.direction = 1;// right direction
    this.dirSettings = [
    {"walk":"walkLeft"},
    {"walk":"walkRight"}
    ];
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
        "images" : ["images/warrior_sprites3.png"],
        "frames" : {
            "height": 85,
            "width" : 85,
            "regX" : 0,
            "regY" : 0
        }
    });
    var hpBar = new createjs.Shape();
    hpBar.graphics.beginFill("#e50707");
    hpBar.graphics.drawRect(
        game.stage.canvas.width / 2 - 400, 
        20,
        800,
        50
        );
    game.stage.addChild(hpBar);
    this.walk = function(x,y, walkCallback){
        if(actionFlag){
            return false;
        };
        actionFlag = 1;
        me.direction = (x > me.imgObj.x)+0;
        me.imgObj.gotoAndPlay(me.dirSettings[me.direction]["walk"]);
        game.marker = new marker(x,y);
        game.stage.addChild(game.marker.imgObj);
        createjs.Tween.get(me.imgObj)
        .to({ x: x, y: y}, parseInt((Math.abs(x - me.imgObj.x) + Math.abs(y - me.imgObj.y)) / 0.3), createjs.Ease.getPowInOut(1.5))
        .call(function(){
            if (walkCallback){
                walkCallback();
                setTimeout(function(){
                    actionFlagFight = 0;
                }, 1000)              
            } else {
                me.imgObj.gotoAndStop(me.dirSettings[me.direction]["walk"]);
            }
            actionFlag = 0;
            game.stage.removeChild(game.marker.imgObj);
        });
    };
    this.imgObj = new createjs.Sprite(heroSprites);
    this.imgObj.gotoAndStop("walkRight");
    game.stage.addChild(this.imgObj);
    me.gotoAndFight = function(monster, monsterHP, defaultHP, nameOfBar){
        if (actionFlagFight == 1) {
            return false
        };
        actionFlagFight = 1;
        if (me.imgObj.x > monster.imgObj.x) {
            me.walk(monster.imgObj.x + 85, monster.imgObj.y, function() {
                me.imgObj.gotoAndPlay("attackLeft");
                //game.monster.imgObj.gotoAndPlay("walkRight")
                setTimeout(function(){
                    me.imgObj.gotoAndStop("walkLeft");
                    minusHP(monster, monsterHP, defaultHP, nameOfBar);                                        
                },1000)
            });           
        } else {
            me.walk(monster.imgObj.x - 85, monster.imgObj.y, function(){
                me.imgObj.gotoAndPlay("attackRight");
                setTimeout(function(){                   
                    me.imgObj.gotoAndStop("walkRight");
                    minusHP(monster, monsterHP, defaultHP, nameOfBar);
                    //actionFlagFight = 0;
                },1000);
            });
            
        }
    };};
// decorations
function Clock(x,y) {
    var clockSprites = new createjs.SpriteSheet({
        "animations": {
            "default": {
                "frames" : [0,1,2,1],
                "speed": 0.05
            }
        },
        "images": ["images/animated_clock_1.png"],
        "frames": {
            "height": 96,
            "width": 32,
            "regX": 0,
            "regY":0
        }
    });
    this.imgObj = new createjs.Sprite(clockSprites);
    this.imgObj.gotoAndPlay("default");
    createjs.Tween.get(this.imgObj)
    .to({x: x, y: y})
    game.stage.addChild(this.imgObj);
};
function marker(x,y){
    var marker = new createjs.SpriteSheet({
        "images": ["images/marker2.png"],
        "frames": {
            "height": 40,
            "width": 40,
            "regX":0,
            "regY": 0
        }
    });
    this.imgObj = new createjs.Sprite(marker);
    //createjs.Tween.get(this.imgObj);
    createjs.Tween.get(this.imgObj)
    .to({x: x + 20, y: y + 20});
    game.stage.addChild(this.imgObj);
};

// game functions
function minusHP (monster, monsterHP, defaultHP, bar){
    // monsterHP = monsterHP  - 1;
    console.log(monsterHP);
    console.log(bar);
    if (monsterHP == defaultHP * 0.8) {
        alert('nice');
        bar.graphics.beginFill("#ffb400");
        nameOfBar.drawRect(
            monster.imgObj.x,
            monster.imgObj.y - 20,
            monster.nameOfBar.width - monster.nameOfBar.width * 0.2,
            monster.nameOfBar.height
            );
    };
};
function spawnHPbar (monster, x, y , width, height){
    hpBar = new createjs.Shape();
    hpBar.graphics.beginFill('green');
    hpBar.graphics.drawRect(x,  y, width, height);    
    game.stage.addChild(hpBar); 
};
function Game(stageId){
    // code here.
    var me = this;
    this.stage = new createjs.Stage(stageId);
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
        me.knight = new Knight();
        var snake1 = new Snake(150,150,3);
        me.clock = new Clock(400,100);
        var snake2 = new Snake(300,300);
        var harpy = new Harpy(450,350);
        me.stage.update();
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", handleEvent);
        function handleEvent(){
            me.stage.update();               
        }
    };
}