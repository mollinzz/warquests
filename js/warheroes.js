function Snake(){
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
    this.snakeAnimation = new createjs.Sprite(snakeSprites);
    game.stage.addChild(this.snakeAnimation);   
    this.snakeAnimation.gotoAndPlay("walkLeft");
    //this.snakeAnimation.x
    createjs.Tween.get(this.snakeAnimation)
    .to({x:150, y:150});
    // addEventListener("click", function(event){
    //     me.snakeAnimation.gotoAndPlay("walkLeft")
    // })
}

function Knight(){
    var me = this;
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
        me.direction = (x > me.imgObj.x)+0;
        me.imgObj.gotoAndPlay(me.dirSettings[me.direction]["walk"])
        createjs.Tween.get(me.imgObj)
            .to({ x: x - 42.5 , y: y - 42.5}, parseInt(Math.abs(x - me.imgObj.x) / 0.3), createjs.Ease.getPowInOut(2))
            .call(function(){
                me.imgObj.gotoAndStop(me.dirSettings[me.direction]["walk"]);
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
};

function Game(stageId){
        // code here.
        var me = this;
        this.stage = new createjs.Stage(stageId);

        this.start = function(){
        me.knight = new Knight();
        me.snake = new Snake();
        me.stage.update();
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