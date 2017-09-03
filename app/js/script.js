/** Saving objects to localStorage */
function Storage() {
  var me = this;
  this.object = {};
  /** Saving */
  this.save = function() {
    var sObj = JSON.stringify(this.object);
    localStorage.setItem("object", sObj);
  };

  /** Loading */
  this.load = function() {
    me.object = JSON.parse(localStorage.getItem("object"));
    if (me.object == null) {
      me.object = {};
    }
  };
  this.load();

  /** Adding it to loacal storage */
  this.setField = function(itemKey, itemVal) {
    me.object[itemKey] = itemVal;
    me.save();
  };

  /** Getting from local storage */
  this.getField = function(itemKey) {
    return me.object[itemKey];
  };

  /** Refreshing items */
  this.refresh = function(itemKey, oldVal, value) {
    if (!oldVal) {
      oldVal = 0;
    };
    // localStorage.removeItem(itemKey);
    this.setField(itemKey, oldVal + value);
  };

  /** Removing from local storage */
  this.remove = function(itemKey) {
    localStorage.removeItem(itemKey);
  };
};

/** Spawner of monsters */
function MonsterSpawner() {
  var me = this;
  var countMonster = 0;

  /** Spawning monster with random
   * @param {number} number - number of spawning monsters
   * @param {string} monsterName - name of monster
   */
  this.randomMachine = function(number, monsterName) {
    for (var i = 1; i <= number; i++) {
      me.createMonster(
        Math.random() * (1800 - 100) + 100,
        // Math.random() * game.stage.canvas.width,
        Math.random() * (900 - 100) + 100,
        monsterName
      );
    };
  };

  /** Spawning monsters
   * @param {number} x - x pos
   * @param {number} y - y pos
   * @param {string} monsterName - name of monster to switch constructor
   */
  this.createMonster = function(x, y, monsterName) {
    countMonster++;
    var monster;
    switch (monsterName) {
      case 'snake':
        monster = new Snake(x, y);
        break;
      case 'harpy':
        monster = new Harpy(x, y);
        break;
      case 'reaper':
        monster = new Reaper(x, y);
        break;
    }
    return monster;
  }
};

function AlertMessage() {
  var me = this;
  var container = new createjs.Container();
  game.stage.addChild(container);
  container.x = game.stage.canvas.width / 2 + 480;
  container.y = 20;

  var maskShape = new createjs.Shape();
  maskShape.graphics.drawRect(container.x, container.y, 500, 100);
  container.mask = maskShape;

  container.addEventListener("click", function() {
    return false
  });

  this.alertCollection = {
    bought: "You bought: "
  };

  var textContainer = [];

  var posCollection = [{
    "posY": 0
  }, {
    "posY": 40
  }, {
    "posY": 75
  }];

  var chatBitmap = new createjs.Bitmap("images/chat.png");
  container.addChild(chatBitmap);

  var textAlert = new createjs.Text("", "35px Arial", "white");
  container.addChild(textAlert);

  this.createAlert = function(mainText) {
    textAlert.text = mainText + "\n" + textAlert.text;
  };
};
