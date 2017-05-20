function Snake(x,y){
    //спрайты
    var me = this;
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
            },
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
    })
    //добавление змеи на сцену
    this.imgObj = new createjs.Sprite(snakeSprites);
    game.stage.addChild(this.imgObj);   
    this.imgObj.gotoAndPlay("walkLeft");
    //this.snakeAnimation.x
    createjs.Tween.get(this.imgObj)
    .to({x:x, y:y});
    me.imgObj.addEventListener("click", function(event){
        game.knight.gotoAndFight(me);
    });
}

function Knight(){
    var me = this, actionFlag = 0;
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
            }
        },
        "images" : ["images/warrior_sprites.png"],
        "frames" : {
            "height": 85,
            "width" : 85,
            "regX" : 0,
            "regY" : 0
        }
    });
    this.walk = function(x,y){
        if(actionFlag){
            return false;
        };
        actionFlag = 1;
        me.direction = (x > me.imgObj.x)+0;
        me.imgObj.gotoAndPlay(me.dirSettings[me.direction]["walk"])
        createjs.Tween.get(me.imgObj)
        .to({ x: x, y: y}, parseInt((Math.abs(x - me.imgObj.x) + Math.abs(y - me.imgObj.y)) / 0.3), createjs.Ease.getPowInOut(2))
        .call(function(){
            me.imgObj.gotoAndStop(me.dirSettings[me.direction]["walk"]);
            actionFlag = 0;
        });
    };
    this.imgObj = new createjs.Sprite(heroSprites);
    this.imgObj.gotoAndStop("walkRight");
    game.stage.addChild(this.imgObj);
    // knightAnimation.x += step;
    //         if (knightAnimation.x > 300) {
    //             step = -10;
    //             knightAnimation.gotoAndPlay("walkLeft");
    //         };
    me.gotoAndFight = function(monster){
        if (me.imgObj.x > monster.imgObj.x) {
            me.walk(monster.imgObj.x + 85, monster.imgObj.y);
        } else {
            me.walk(monster.imgObj.x - 85, monster.imgObj.y);
        }
    };
};

function Game(stageId){
        // code here.
        var me = this;
        this.stage = new createjs.Stage(stageId);
        this.start = function(){
            var bg1 = new createjs.Shape()
            bg1.graphics.beginFill("ghostwhite") // first bg is white
            bg1.graphics.drawRect(
              0,                    // x position
              0,                    // y position
              me.stage.canvas.width,   // width of shape (in px)
              me.stage.canvas.height   // height of shape (in px)
            );
            // Can only define this after shape is drawn, else no fill applies
            bg1.graphics.ef(); // short for endFill()
            me.stage.addChild(bg1);  // Add Child to Stage
            me.knight = new Knight();
            var snake1 = new Snake(150,150);
            var snake2 = new Snake(300,300);
            me.stage.update();
            window.addEventListener('resize', me.resizeCanvas, false);        
            me.resizeCanvas = function () {
                me.stage.canvas.width = window.innerWidth;
                me.stage.canvas.height = window.innerHeight;
            }       
        // createjs.Tween.get(circle, { loop: true })
        // .to({ x: 1000 }, 1000, createjs.Ease.getPowInOut(4))
        // .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
        // .to({ alpha: 0, y: 225 }, 100)
        // .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
        // .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));
        // createjs.Tween.get(knightAnimation)
        // .to({x: 1000},1500);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", handleEvent);
        function handleEvent(){
            me.stage.update();
            
        }
    };
}