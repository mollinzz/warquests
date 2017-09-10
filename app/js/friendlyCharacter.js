  function FriendlyCharacter(characterName, animations, image, spriteWidth, spriteHeight, x, y) {
    var me = this;
    var currentQuest;
    var actionFlag = 0;
    var interval;
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
    buttonNext.graphics.drawRect(spriteWidth - 125, spriteHeight * 2 + 250, 125, 50);
    containerChat.addChild(buttonNext);

    var buttonCancel = new createjs.Shape();
    buttonCancel.graphics.beginFill("pink");
    buttonCancel.graphics.drawRect(spriteWidth, spriteHeight * 2 + 250, 125, 50);
    containerChat.addChild(buttonCancel);
    buttonCancel.addEventListener("click", function() {
      if (actionFlag) {
        me.closeMessage();
      }
    });

    this.closeMessage = function() {
      if (interval) {
        clearInterval(interval);
      };
      actionFlag = 0;
      containerChat.visible = false;
      textMessage.text = "";
      buttonNext.removeEventListener('click', listener)
    }
    this.closeMessage();

    this.say = function(text) {
      textMessage.text = text;
    };

    var i = 0;
    var listener = function() {
      if (actionFlag) {
        if (i == 2) {
          game.quests.questArray.push(currentQuest.info);
          game.storage.setField("quests", game.quests.questArray);
          game.quests.questArray = game.storage.getField("quests");
          me.closeMessage();
        } else {
          me.say(currentQuest.texts[i]);
          i++;
        };
      };
    };
    this.personObj.addEventListener("click", function() {
      game.knight.walk(x, y, function() {
        containerChat.visible = true;
        buttonNext.visible = true;
        buttonCancel.graphics.clear();
        buttonCancel.graphics.beginFill("pink");
        buttonCancel.graphics.drawRect(spriteWidth, spriteHeight * 2 + 250, 125, 50);
        actionFlag = 1;
        i = 0;
        if (!game.storage.getField(characterName)) {
          currentQuest = quests[questSettings[characterName][0]];
        } else {
          currentQuest = quests[questSettings[characterName][game.storage.getField(characterName)]];
        };

        game.knight.imgObj.gotoAndStop();
        game.quests.checkForComplete();
        for (var i3 = 0; i3 < game.quests.questArray.length; i3++) {
          if (quests[game.quests.questArray[i3].name].conditions(game.quests.questArray[i3].progress)) {
            buttonNext.visible = false;
            me.say(currentQuest.texts[3]);
            buttonCancel.graphics.clear();
            buttonCancel.graphics.beginFill("pink");
            buttonCancel.graphics.drawRect(spriteWidth - 125, spriteHeight * 2 + 250, 250, 50);
            i = 0;
            quests[game.quests.questArray[i3].name].reward();
            game.quests.questArray.splice([i3], 1);
            game.storage.setField("quests", game.quests.questArray);
            if (!game.storage.getField(characterName)) {
              game.storage.refresh(characterName, 0, 1);
            } else {
              game.storage.refresh(characterName, game.storage.getField(characterName), 1);
            }
            game.inventory.refresh();
            return false;
          };
        };
        for (var i2 = 0; i2 < game.quests.questArray.length; i2++) {
          if (game.quests.questArray[i2]) {
            if (game.quests.questArray[i2].name == currentQuest.info.name) {
              buttonNext.visible = false;
              buttonCancel.graphics.clear();
              buttonCancel.graphics.beginFill("pink");
              buttonCancel.graphics.drawRect(spriteWidth - 125, spriteHeight * 2 + 250, 250, 50);
              i = 0;
              me.say(currentQuest.texts[2]);
              return false;
            };
          }
        };
        me.say(currentQuest.texts[i]);
        i++;
        buttonNext.addEventListener("click", listener);
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

  function Elder(x, y) {
    this.prototype = new FriendlyCharacter(
      "elder", [6, 7, 8, 7], "images/man.png", 47, 63, x, y
    );
    this.prototype.personObj.scaleX = 2;
    this.prototype.personObj.scaleY = 2;
  };
