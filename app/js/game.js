/** Main game func */
function Game(stageId) {
  this.abilityFlag = 1;
  this.showAbility = 1;
  // code here.
  var me = this;

  // this.home = function() {
  //   var level = "home";
  //   var settings = levelSettings[level];
  //   me.stage.addChild(this.bg1);
  // };

  this.start = function() {
    this.storage = new Storage();
    this.stage = new createjs.Stage(stageId);
    this.spawner = new MonsterSpawner();
    this.itemCollection = new ItemCollection();
    // me.stage.autoClear = false;
    if (!game.storage.getField("levelPoints")) {
      game.storage.setField("levelPoints", 0);
    };
    if (!game.storage.getField("level")) {
      game.storage.setField("level", 1);
    };
    if (!game.storage.getField("coins")) {
      game.storage.setField("coins", 0);
      alert(game.storage.getField("coins"));
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
    // canvas background
    me.levelGenerator = new LevelGenerate();
    me.inventory = new Inventory();
    me.abilityPanel = new AbilityPanel();
    me.knight = new Knight();
    me.equipmentPanel = new EquipmentPanel();
    me.levelGenerator.createlevel('home');
    me.market = new Market();
    me.alert = new AlertMessage();
    // me.decor = new Decor();


    var factor;
    var factor2;
    setInterval(function() {
      factor = Math.random() * 3000;
      setTimeout(function() {
        me.knight.regen(me.knight.knightHP, me.knight.defaultHP, me.knight.hpBar, 20, 50, "#e50707");
      }, factor);
    }, 5000);

    setInterval(function() {
      factor2 = Math.random() * 5000;
      setTimeout(function() {
        // alert(me.knight.regen)
        me.knight.regen(me.knight.manaPoints, me.knight.defaultMana, me.knight.manaBar, 70, 25, "#005aff");
      }, factor2);
    }, 6000);

    setInterval(function() {
      if (me.knight.knightHP <= 0) {
        me.knight.die();
        setTimeout(function() {
          location.reload();
        }, 1000)
      }
    }, 100)

    me.stage.update();
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", handleEvent);

    function handleEvent() {
      me.stage.update();
    }
  };
}
