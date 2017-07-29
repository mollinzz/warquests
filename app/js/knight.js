/** Main hero
 * @constructor
 */
 function Knight(){
 	this.knightHP = 15;
 	var actionsFlag = 0;
 	var me = this;
 	this.defaultHP = this.knightHP;
 	var factorKnight;
 	var apple;
	 this.direction = 1;// right direction
	 this.dirSettings = [
	 {"walk":"walkLeft"},
	 {"walk":"walkRight"}
	 ];
	 this.skills = {
	 	shieldBlock: 1,
	 	slam: 2,
	 	movementSpeed: 0.3,
	 	attack: 1,
	 	manaPoints: 10
	 };

    /** Sprites setting */
    var knightSprites = new createjs.SpriteSheet({
     "animations" : {
        "walkRight": {
           "frames": [0,3],
           "speed": 0.1
       },
       "walkLeft": {
           "frames": [4,7],
           "speed": 0.1
       },
       "attackRight": {
           "frames":[8,9,10,9],
           "speed": 0.1
       },
       "attackLeft": {
           "frames": [12,13,14],
           "speed": 0.1
       }
   },
   "images" : ["images/warrior_sprites4.png"],
   "frames" : {
    "height": 127.5,
    "width" : 127.5,
    "regX" : 0,
    "regY" : 0
}
});

    this.imgObj = new createjs.Sprite(knightSprites);
    this.imgObj.gotoAndStop("walkRight");
    game.stage.addChild(this.imgObj);

    /** Knight walking
     * @param {number} x - x position of walking point.
     * @param {number} y - y position of walking point.
     * @param {function} walkCallback - callback oafter walking back.
     * @param {boolean} forceFlag - flag of required action.
     */
     this.walk = function(x,y, walkCallback, forceFlag = false){
     	if (actionsFlag && !forceFlag) {
     		return false
     	};
     	actionsFlag++;
     	me.direction = (x > me.imgObj.x)+0;
     	me.imgObj.gotoAndPlay(me.dirSettings[me.direction]["walk"]);
        //spawning marker
        game.marker = new marker(x,y);
        game.stage.addChild(game.marker.imgObj);

        //moving
        createjs.Tween.get(me.imgObj)
        .to({ x: x, y: y}, parseInt((Math.abs(x - me.imgObj.x) + Math.abs(y - me.imgObj.y)) / me.skills.movementSpeed), createjs.Ease.getPowInOut(1.5))
        .call(function(){
        	if (walkCallback){
        		walkCallback();     
        	} else {
        		me.imgObj.gotoAndStop(me.dirSettings[me.direction]["walk"]);
        	};
        	game.stage.removeChild(game.marker.bitmap);
        	actionsFlag--;
        });
    };

    /** Fighting with monsters.
     * @param {Monster} monster - attacking monster.
     * @param {number} monsterHP - healph points of monster.
     * @param {number} monsterAttack - attack points of monster.
     * @param {function} callback - callback after going.
     */
     this.gotoAndFight = function(coinValue, monster, monsterHP, monsterAttack, callback){
     	if (actionsFlag) {
     		return false;
     	}
     	actionsFlag++;
     	target = monster;
     	if (me.imgObj.x > monster.imgObj.x) {
     		me.walk(monster.imgObj.x + 127.5, monster.imgObj.y, function() {
	        //starting animation
	        me.imgObj.gotoAndPlay("attackLeft");
	        //callback
	        setTimeout(function(){
	        	callback();
	        	me.imgObj.gotoAndStop("walkLeft");
	        	me.minusHPKnight(monsterAttack);
	        	actionsFlag--;
	        },1000)
     }, true);           
     	} else {
     		me.walk(monster.imgObj.x - 127.5, monster.imgObj.y, function(){
                //starting animation
                me.imgObj.gotoAndPlay("attackRight");

                //callback
                setTimeout(function(){
                	callback();                            
                	me.imgObj.gotoAndStop("walkRight");
                	me.minusHPKnight(monsterAttack);
                	actionsFlag--;   
                },1000);
            }, true);

     	}
     };

    /** Minusing HP of knight
     *  @param {number} monsterAttack - value of attack point
     */
     this.minusHPKnight = function(monsterAttack){       
     	me.knightHP = me.knightHP - monsterAttack;
     	me.refreshBar(me.knightHP, me.defaultHP, this.hpBar, 20, 50);
     };

    /** Plus HP of knight
     *  @param {number} value - value of plusing hp
     */
     this.plusHPKnight = function(value){       
     	me.knightHP = me.knightHP + value;
     	me.refreshBar(me.knightHP, me.defaultHP, this.hpBar, 20, 50);
     };

     this.hpBar = new createjs.Shape();
     this.hpBar.graphics.beginFill("#e50707");
     this.hpBar.graphics.drawRect(
     	game.stage.canvas.width / 2 - 400, 
     	20,
     	800,
     	50
     	);
     game.stage.addChild(this.hpBar);

     this.manaBar = new createjs.Shape();
     this.manaBar.graphics.beginFill("#005aff");
     this.manaBar.graphics.drawRect(
     	game.stage.canvas.width / 2 - 400, 
     	70,
     	800,
     	25
     	);
     game.stage.addChild(this.manaBar);

     /** Refreshing of healph bar */
     this.refreshBar = function(count1, count2, bar, y, width){
        // game.stage.removeChild(hpBar);
        factorKnight = parseInt(count1 / count2 * 100) / 100; 
        //console.log(factorKnight);
        bar.graphics.clear();     
        bar.graphics.beginFill('#e50707');
        bar.graphics.drawRect(game.stage.canvas.width / 2 - 400, y, factorKnight * 800, width);       
        //game.stage.addChild(hpBar);
    };

    /** Regenerating */
    this.regen = function(){
     if (me.knightHP < me.defaultHP) {
        console.log(me.knightHP);
        me.plusHPKnight(1);
        me.refreshBar(me.knightHP, me.defaultHP, this.hpBar, 20, 50);
    }   
};

    /** Using ability
     * @param {object} target - target of using ability
     * @param {string} abilityName - name of ability to switch construction 
     */
     this.useAbility = function(target, abilityName){
     	var abilityFlag = 0;
     	if (abilityFlag) {
     		return false
     	}
     	abilityFlag = 1;
     	switch(abilityName) {
     		case "shieldUp": 
     		if (knightHP >= me.defaultHP) {
     			return false
     		};
     		if (knightHP + 5 >= me.defaultHP) {
     			knightHP = defaultHP;
     			return false
     		}
             knightHP = knightHP + 5;
             abilityFlag = 0;
         }
     }
 };