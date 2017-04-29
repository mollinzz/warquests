function Game(settings) {
    this.stage = new Stage(settings.stage);
    this.storage = new Storage();
    this.start = function() {
        var gamerName = this.storage.getField('gamerName');
        if (!gamerName) {
            gamerName = prompt('Enter name', 'name');
            this.storage.setField('gamerName',gamerName);
        } 
        this.stage.jqEl.append("<p>hello, "+gamerName+"</p>");
    }

}

function Knight(settings){
    this.id='knight';
    //this.imgSrc='images/FFRK_Warrior_sprites.png';
    this.posX = settings.posX ? settings.posX : 0;
    this.posY = settings.posY ? settings.posY : 0;
    this.getTag=function(){
        return '<div id="'+this.id+'"></div>';
    }
    this.registerTag = function(){
        this.jqEl = $('#'+this.id);
        this.registerWalk();
    }
    var me = this;
    this.registerWalk = function(){
        game.stage.jqEl.on('click', function(e){
            console.log(e);
        game.stage.jqEl.append('<div class="marker"></div>');
        $('.marker').animate({
            top: e.offsetY  + 'px',
            left: e.offsetX  + 'px'
        },0,'swing')
            me.walk(e.offsetX, e.offsetY, function(){
                $('.marker').remove();
            });
        })
    }
    this.updatePosition=function() {
        this.parent.jqEl.css('top', this.posY+'px');
        this.parent.jqEl.css('left', this.posX+'px');
    }
    this.walk = function(x, y, callback){
        this.jqEl.animate({
            top: y   + 'px',
            left: x  + 'px'
        },500,'swing', callback);
    }
}

function Stage(selector){
    this.addPerson = function(character){
        this.jqEl.append(character.getTag());
        character.registerTag();
    }
    this.jqEl = $(selector);
    this.jqEl.css('background-color', '#ADFF2F');
    this.jqEl.css('height', '100%');
    this.jqEl.css('width', '100%');

}

function Storage(){
    var me=this;
    this.object = {};
    this.save = function(){
        var sObj = JSON.stringify(this.object);
        localStorage.setItem("object", sObj);

    };

    this.load = function(){

        me.object = JSON.parse(localStorage.getItem("object"));
        if (me.object==null) {
            me.object={};
        }
    } 
    this.load();
    this.setField = function(itemKey, itemVal){
        me.object[itemKey] = itemVal;
        me.save();
    }
    this.getField = function(itemKey){
        return  me.object[itemKey];
    }
}