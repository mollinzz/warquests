//monster func
function Monster(monsterSprites, standFrames, image,spriteWidth ,spriteHeight , x, y, monsterHP, monsterhpbar,
    widthBar, heightBar, nameOfMonster){
    var me = this;
    var monsterHP = monsterHP;
    var defaultHP = monsterHP;
    var nice = 0;
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

    var hpText;
    var monsterhpbar = new createjs.Shape();

    //hpbar
    function hpReload(){
        game.stage.removeChild(hpText);
        monsterhpbar.graphics.beginFill('#cc0000');
        monsterhpbar.graphics.drawRect(
            x,
            y - 75,
            widthBar,
            heightBar
            );
        hpText = new createjs.Text(monsterHP +'/'+ defaultHP, "15px Arial", "#black");
        nameText = new createjs.Text(nameOfMonster, "20px Arial", "black")
        createjs.Tween.get(hpText)
        .to({x: x + widthBar / 2 - 15 , y: y - 75 });
        game.stage.addChild(monsterhpbar);
        createjs.Tween.get(nameText)
        .to({x: x + widthBar / 2 - 20 , y: y - 100 });
        game.stage.addChild(hpText);
        game.stage.addChild(nameText);
        //console.log(monsterhpbar)
    };

    //checking click
    me.imgObj.addEventListener("click", onMonsterClick);
    function onMonsterClick(ev){
        if (nice) {
            return false;
        }
        nice = 1;
        console.log(monsterHP);
        game.knight.gotoAndFight(me, monsterHP);
        hpReload();
        setTimeout(function(){
            monsterHP--;
            hpReload();
            nice = 0;
            if (!monsterHP) {
                game.stage.removeChild(me.imgObj);
                if (monsterhpbar) {
                    console.log('Hello');
                    console.log(monsterhpbar);
                    game.stage.removeChild(monsterhpbar);
                };
                if(hpText) {
                    game.stage.removeChild(hpText);
                };
            // return false
        };
    },1000);
    };
};

//persons
function Snake(x,y, bar){
    var snake = new Monster("snakeSprites",[6,7,8,7],"images/king_cobra3.png",93,93.8,x,y,objects[0].hp,bar,100,50, 'King cobra');

};
function Harpy(x, y, bar) {
var harpy = new Monster(
        "harpySprites",
        [0,1,2,1],
        "images/harpy.png",
        105,
        87,
        x, y,
        objects[1].hp,
        bar,
        70,
        15
        );
}
function Knight(){
    var me = this, actionFlag = 0, actionFlagFight = 0;
    var knigthHP = objects[2].hp;
    //var dropHP = knigthHP * 0.1;
    drop = knigthHP*0.1;
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

    //hpbar
    var hpBar = new createjs.Shape();
    hpBar.graphics.beginFill("#e50707");
    hpBar.graphics.drawRect(
        game.stage.canvas.width / 2 - 400, 
        20,
        800,
        50
        );
    game.stage.addChild(hpBar);

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
    me.gotoAndFight = function(monster, monsterHP, defaultHP, bar){
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
                    me.imgObj.gotoAndStop("walkLeft");
                    monsterHP--;
                },1000)
            });           
        } else {
            me.walk(monster.imgObj.x - 127.5, monster.imgObj.y, function(){
                //starting animation
                me.imgObj.gotoAndPlay("attackRight");

                //callback
                setTimeout(function(){                   
                    me.imgObj.gotoAndStop("walkRight");
                    monsterHP--;
                },1000);
            });
            
        }
    };
    me.minusHPKnight = function(){
    }
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
    me.randomMachine = function() {

    }
    me.createMonster = function(x, y, monsterName) {

    }

}

//game func
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
        //monsterSprites, standFrames, image, spriteHeight, spriteWidth, x, y, monsterHP, monsterhpbar,
    //widthBar, heightBar
    me.knight = new Knight();
    // var snake = new Monster(
    //     "snakeSprites",
    //     [6,7,8,7],
    //     "images/king_cobra.png",
    //     63,
    //     63,
    //     250,
    //     250,
    //     objects[0].hp,
    //     "snakebar",
    //     63,
    //     15);
    // var snake1 = snake;
    Snake(100,100, "snakebar1");
    Snake(300, 400, "snakebar2")
    Harpy(200,300, 'harpy1'); 
    me.stage.update();
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", handleEvent);
    function handleEvent(){
        me.stage.update();               
    }
};
}