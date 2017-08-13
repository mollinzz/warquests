/** Main game func */
function Game(stageId) {
  // code here.
  var me = this;
  this.storage = new Storage();
  this.stage = new createjs.Stage(stageId);
  this.spawner = new MonsterSpawner();
  this.itemCollection = new ItemCollection();
  this.start = function() {
    this.abilityFlag = 1;
    if (!game.storage.getField("levelPoints")) {
      game.storage.setField("levelPoints", 0);
    };
    if (!game.storage.getField("level")) {
      game.storage.setField("level", 1);
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
    var bg1 = new createjs.Shape();
    bg1.graphics.beginFill("#51d977"); // first bg
    bg1.graphics.drawRect(
      0,
      0,
      me.stage.canvas.width,
      me.stage.canvas.height
    );

    bg1.graphics.ef();
    me.stage.addChild(bg1);

    me.inventory = new Inventory();
    me.abilityPanel = new AbilityPanel();
    me.knight = new Knight();
    me.equipmentPanel = new EquipmentPanel();
    this.decor = new Decor();
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