  function Decor(animations, usedAnimations, image, spriteWidth, spriteHeight, x, y, useFunc) {
    var me = this;
    var usingFlag = 0;
    var decorSprites = new createjs.SpriteSheet({
      "animations": {
        "default": {
          "frames": animations,
          "speed": 0.1
        },
        "used": {
          "frames": usedAnimations,
          "speed": 0.2
        }
      },
      "images": [image],
      "frames": {
        "height": spriteHeight,
        "width": spriteWidth,
        "regX": 0,
        "regY": 0
      }
    });
    var decorObj = new createjs.Sprite(decorSprites);
    game.stage.addChild(decorObj);
    createjs.Tween.get(decorObj)
      .to({
        x: x,
        y: y
      });
    decorObj.gotoAndPlay("default");

    me.playUsed = function() {
      decorObj.gotoAndPlay("used");
    }

    decorObj.addEventListener("click", function() {
      if (usingFlag == 1 || game.knight.actionsFlag == 1) {
        return false;
      };
      usingFlag = 1;

      useFunc();
      setTimeout(function() {
        usingFlag = 0;
      }, 1400)
    })
  };

  function createFromSettings(decorName, x, y, options) {
    switch (decorName) {
      case "weaponShop":
        new House2(x, y)
        break;
      case "potionShop":
        new House(x, y)
        break;
      case "portal":
        new Portal(x, y, options)
        break;
        case "man":
          new Man(x, y);
          break;
    };
  };

  function House(x, y) {
    this.prototype = new Decor([0], [0], "images/house1x1.png", 200, 168, x, y, function() {
      game.market.open("potionShop")
    })
  };

  function House2(x, y) {
    this.prototype = new Decor([0], [0], "images/house2x1.png", 126, 126, x, y, function() {
      game.market.open("weaponShop")
    });
    //  console.log(this.prototype)
  };

  function Portal(x, y, options) {
    var me = this;
    this.prototype = new Decor([16], [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 10, 11, 12, 13, 14, 15, 16], "images/portal.png", 64, 64, x, y, function() {
      game.knight.walk(x, y, function() {
        game.knight.actionsFlag = 1;
        me.prototype.playUsed();
        setTimeout(function() {
          game.levelGenerator.createInterface();
          game.levelGenerator.createLevelEnvironment(options.target);
          game.knight.actionsFlag = 0;
        }, 1400)
      })

    })
  };
