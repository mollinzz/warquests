function AbilityPanel() {
  var me = this;
  var container = new createjs.Container();
  game.stage.addChild(container);
  container.x = game.stage.canvas.width / 2 - 200;
  container.y = game.stage.canvas.height - 129;

  var mainBlock = new createjs.Shape();
  mainBlock.graphics.beginFill('yellow');
  mainBlock.graphics.drawRect(0, 0, 321, 109);
  container.addChild(mainBlock);

  this.slamSlot = new AbilityPanelSlot("slam", 3, container)
  this.healSlot = new AbilityPanelSlot("heal", 106, container)

  container.addEventListener("click", function(){
   return false 
  });
};

/** Single slot for ability panel
 * @param {string} slotName - name of slot
 * @param {number} x - x pos
 * @param {Object} container - cretejs container for slot
 */
function AbilityPanelSlot(slotName, x, container) {
  var me = this;
  var slotSettings = {
    slam: {
      spriteSettings: {
        "animations": {
          "notUsed": {
            "frames": [0]
          },
          "used": {
            "frames": [1]
          }
        },
        "images": ["images/slam.png"],
        "frames": {
          "height": 100,
          "width": 100,
          "regX": 0,
          "regY": 0
        }
      },
      timeOut: 4
    },
    heal: {
      spriteSettings: {
        "animations": {
          "notUsed": {
            "frames": [0]
          },
          "used": {
            "frames": [1]
          }
        },
        "images": ["images/heal.png"],
        "frames": {
          "height": 100,
          "width": 100,
          "regX": 0,
          "regY": 0
        }
      },
      timeOut: 5
    }
  };
  var image = new createjs.SpriteSheet(slotSettings[slotName].spriteSettings);
  this.sprite = new createjs.Sprite(image);
  this.sprite.gotoAndStop("notUsed");
  createjs.Tween.get(this.sprite)
    .to({ x: x, y: 3 });
  container.addChild(this.sprite);

  this.text = new createjs.Text("", "100px Arial", "white");
  container.addChild(this.text);
  this.text.x = x + 20;
  this.text.y = 0;

  this.changeImage = function() {
    me.sprite.gotoAndStop("used");
    setTimeout(function() {
      me.sprite.gotoAndStop("notUsed");
    }, 300);
    me.text.text = slotSettings[slotName]["timeOut"];
    var currentTime = slotSettings[slotName]["timeOut"];
    var intervalId = setInterval(function() {
      currentTime--;
      me.text.text = currentTime;
    }, 1000);
    setTimeout(function() {
      clearInterval(intervalId);
      me.text.text = "";
    }, slotSettings[slotName]["timeOut"] * 1000)
  };
};