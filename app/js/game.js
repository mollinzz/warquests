/** Main game func */
function Game(stageId) {
  this.monsterColl = [];
  this.currentLevel = "home";
  this.abilityFlag = 1;
  this.showAbility = 1;
  // code here.
  var me = this;

  this.start = function() {
    this.storage = new Storage();
    this.stage = new createjs.Stage(stageId);
    this.spawner = new MonsterSpawner();
    this.itemCollection = new ItemCollection();

    this.handleComplete = function() {
      if (!game.storage.getField("levelPoints")) {
        game.storage.setField("levelPoints", 0);
      };
      if (!game.storage.getField("level")) {
        game.storage.setField("level", 1);
      };
      if (!game.storage.getField("coins")) {
        game.storage.setField("coins", 0);
      };
      me.resizeCanvas = function() {
        gameArea = me.stage.canvas;
        widthToHeight = 2000 / 1000;
        newWidth = window.innerWidth;
        newHeight = window.innerHeight;
        newWidthToHeight = newWidth / newHeight;
        if (newWidthToHeight > widthToHeight) {
          newWidth = newHeight * widthToHeight;
          gameArea.style.height = newHeight + 'px';
          gameArea.style.width = newWidth + 'px';
        } else {
          newHeight = newWidth / widthToHeight;
          gameArea.style.height = newHeight + 'px';
          gameArea.style.width = newWidth + 'px';

        }
        scale = newWidthToHeight / widthToHeight;
        me.stage.width = newWidth;
        me.stage.height = newHeight;
        gameArea.style.marginTop = ((window.innerHeight - newHeight) / 2) + 'px';
        gameArea.style.marginLeft = ((window.innerWidth - newWidth) / 2) + 'px';
      };
      me.resizeCanvas();
      me.loadSounds = function() {
        createjs.Sound.registerSound("sounds/hit.wav", 'hit');
        createjs.Sound.registerSound("sounds/lootCoin.wav", 'lootCoin');
        createjs.Sound.registerSound("sounds/lootItem.wav", 'lootItem');
      };
      me.loadSounds();
      // canvas
      me.levelGenerator = new LevelGenerate();
      me.inventory = new Inventory();
      me.abilityPanel = new AbilityPanel();
      me.knight = new Knight();
      me.equipmentPanel = new EquipmentPanel();
      me.levelGenerator.createLevelEnvironment('home');
      me.market = new Market();
      me.alert = new AlertMessage();
      me.quests = new Quests();
      Man(100, 100);
      Elder(200, 101);
      //Reaper(0, 500);

      me.sortNumber = function(a, b) {
        return a - b;
      };

      me.updateIndex = function() {
        var indexArray = [];
        var frontIndexArray = [];
        var bound;
        var childIndex;
        var emptyBoundsCount = 0;
        var indexCount = 0;

        for (var i = 0; i < game.stage.children.length; i++) {
          bound = game.stage.children[i].getBounds();
          if (bound) {
            if (game.stage.children[i].frontFlag) {
              frontIndexArray.push(Math.floor(game.stage.children[i].y + bound.height))
            } else {
              indexArray.push(Math.floor(game.stage.children[i].y + bound.height));
            };

          };
        };

        indexArray.sort(me.sortNumber);

        for (var i = 0; i < game.stage.children.length; i++) {
          bound = game.stage.children[i].getBounds();
          if (!bound) {
            game.stage.setChildIndex(game.stage.children[i], emptyBoundsCount++);
          };
        };

        for (var i = 0; i < game.stage.children.length; i++) {
          bound = game.stage.children[i].getBounds();
          if (bound && !game.stage.children[i].frontFlag) {
            childIndex = indexArray.indexOf(Math.floor(game.stage.children[i].y + bound.height));
            game.stage.setChildIndex(game.stage.children[i], childIndex + emptyBoundsCount);
            // indexCount = childIndex + emptyBoundsCount;
          };
        };
        //indexCount++;
        for (var i = 0; i < game.stage.children.length; i++) {
          bound = game.stage.children[i].getBounds();
          if (bound && game.stage.children[i].frontFlag) {
            childIndex = indexArray.indexOf(Math.floor(game.stage.children[i].y + bound.height));
            game.stage.setChildIndex(game.stage.children[i], childIndex + 1000);
          };
        };

      };

      me.checkMonsterDistances = function() {
        for (var i = 0; i < me.monsterColl.length; i++) {
          if (me.monsterColl[i]) {
            me.monsterColl[i].checkDistance(me.knight.container.x, me.knight.container.y);
          }
        }
      };

      me.stage.update();
      createjs.Ticker.setFPS(60);
      createjs.Ticker.addEventListener("tick", handleEvent);

      function handleEvent() {
        me.stage.update();
        me.updateIndex();
        me.checkMonsterDistances();
      }
    };
  }
};
