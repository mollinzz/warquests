  function FriendlyCharacter(animations, image, spriteWidth, spriteHeight, x, y) {
    var me = this;

    var personSprites = new createjs.SpriteSheet({
      "animations": {
        "default": {
          "frames": animations,
          "speed": 0.1
        },
      },
      "images": [image],
      "frames": {
        "height": spriteHeight,
        "width": spriteWidth,
        "regX": 0,
        "regY": 0
      }
    });
    var personObj = new createjs.Sprite(personSprites);
    game.stage.addChild(personObj);
    createjs.Tween.get(personObj)
      .to({
        x: x,
        y: y
      });
    personObj.gotoAndPlay("default")
  };

  function Man(x, y) {
    this.prototype = new FriendlyCharacter(
      [1], "images/man.png", 250, 141, x, y
    );
  };
