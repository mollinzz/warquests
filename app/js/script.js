function Game(settings) {
    this.stage = new Stage(settings.stage);
    this.storage = new Storage();
    this.start = function() {
        var gamerName = this.storage.getField('gamerName');
        if (!gamerName) {
            gamerName = prompt('Enter name', 'name');
            this.storage.setField('gamerName', gamerName);
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
    this.direction = 'right';
    this.rightSprites = [
        {top:0, left:0}
    ]
    this.registerWalk = function(){
        game.stage.jqEl.on('click', function(e){
            console.log(e);

            var intervalId = setInterval(function(){
                me.jqEl.css('background-position', '-500px -190px');                
                setTimeout(function(){
                    me.jqEl.css('background-position', '-500px 0px');
                },350,'swing')
            },600, 'swing');

            
            game.stage.jqEl.append('<div class="marker"></div>');
            var markerHeight = parseInt($(".marker").css('height'));
            var markerWidth = parseInt($(".marker").css('width'));
            $('.marker').animate({
                top: e.offsetY - markerHeight / 2 + 'px',
                left: e.offsetX - markerWidth / 2  + 'px'
            },0,'swing')
            me.walk(e.offsetX, e.offsetY, function(){
                $('.marker').remove();
                clearInterval(intervalId);
            });
            
        })
    }
    this.walk = function(x, y, callback){
        var knightHeight = parseInt($("#knight").css('height'));
        var knightWidth = parseInt($("#knight").css('width'));
        // if (x > 500) {
        //         knight.jqEl.css('background-image', 'url(images/FFRK_Warrior_sprites_right.png)')
        //     };
        this.jqEl.animate({
            top: y - knightHeight / 2 + 'px',
            left: x - knightWidth / 2 + 'px'
        },2000,'swing', callback);
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
    this.updatePosition=function() {
        this.this.jqEl.css('top', this.posY+'px');
        this.this.jqEl.css('left', this.posX+'px');
    }
}
function Monster(settings){
    this.id='monster';
    //this.imgSrc='images/FFRK_Warrior_sprites.png';
    this.posX = settings.posX ? settings.posX : 0;
    this.posY = settings.posY ? settings.posY : 0;
    this.getTag=function(){
        return '<div id="'+this.id+'"></div>';
    }
    this.registerTag = function(){
        this.jqEl = $('#'+this.id);
    }
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