function Decor(type, animations, image, spriteWidth, spriteHeight, x, y) {
  if (type == "sprite") {
    var decorSprite = new createjs.SpriteSheet({
      "animations": { animations },
      "image": [image],
      frames: {
        "width": spriteWidth,
        "height": spriteHeight,
        "regX": 0,
        "regY": 0
      }
    });
    var decorObj = new createjs.Sprite(decorSprite);
    game.stage.addChild(decorObj);
    createjs.Tween.get(decorObj)
      .to({ x: x, y: y });
  };
  if (type == "bitmap") {
    bitmap = new createjs.Bitmap(image);
    bitmap.x = x;
    bitmap.y = y;
    game.stage.addChild(bitmap);
  }
};

function House() {
  this.prototype = new Decor("bitmap", 0, "images/house1x1.png", 0, 0, 300, 100)
};