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
    }
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
        Math.random() * game.stage.canvas.width,
        Math.random() * game.stage.canvas.height,
        monsterName
      );
    }
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

function Bar(width, height, x, y, color, container) {
  var me = this;
  bar = new createjs.Shape();
  bar.graphics.beginFill(color);
  bar.graphics.drawRect(
    width,
    height,
    x,
    y
  );
  container.addChild(bar);
};