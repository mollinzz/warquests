  function FriendlyCharacter(characterName, animations, image, spriteWidth, spriteHeight, x, y) {
    var me = this;
    var container = new createjs.Container();
    game.stage.addChild(container);
    var containerChat = new createjs.Container();
    container.addChild(containerChat);
    container.x = x;
    container.y = y;
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
    this.personObj = new createjs.Sprite(personSprites);
    container.addChild(this.personObj);
    this.personObj.gotoAndPlay("default");
    var textBackground = new createjs.Shape();

    textBackground.graphics.beginFill("white");
    textBackground.graphics.drawRect(spriteWidth - 125, spriteHeight * 2, 250, 300);
    containerChat.addChild(textBackground);

    var textMessage = new createjs.Text("", "35px Arial", "Black");
    textMessage.x = spriteWidth - 125;
    textMessage.y = spriteHeight * 2;
    textMessage.lineWidth = 250;
    containerChat.addChild(textMessage);

    var buttonNext = new createjs.Shape();
    buttonNext.graphics.beginFill("blue");

    this.closeMessage = function() {
      containerChat.visible = false;
      textMessage.text = "";
    }
    this.closeMessage();

    this.say = function(text) {
      debugger;
      containerChat.visible = true;
      textMessage.text = text;
    };

    this.personObj.addEventListener("click", function() {
      game.knight.walk(x, y, function() {
        var currentQuest = quests[questSettings[characterName][0]];
        var i = 0;
        var interval = setInterval(function() {
          me.say(currentQuest.info[i]);
          i++;
          if (i == currentQuest.info.length - 1) {
            clearInterval(interval);
            me.closeMessage();
          }
        }, 2000);

      });
    });

  };

  function Man(x, y) {
    this.prototype = new FriendlyCharacter(
      "man", [6, 7, 8, 7], "images/man.png", 47, 63, x, y
    );
    this.prototype.personObj.scaleX = 2;
    this.prototype.personObj.scaleY = 2;
  };
