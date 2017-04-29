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
        this.id=Knight;
        //this.imgSrc='images/FFRK_Warrior_sprites.png';
        this.posX = settings.posX ? settings.posX : 0;
        this.posY = settings.posY ? settings.posY : 0;
        this.__proto__ = new Person(this);

    }

function Stage(selector){
    this.addPerson = function(character){
        this.jqEl.append(character.getTag());
            //character.storeTag();
        }
        this.jqEl = $(selector);
        this.jqEl.css('background-color', '#ADFF2F');
        this.jqEl.css('height', '100%');
        this.jqEl.css('width', '100%');

    }
    function Person (parent) {
        this.parent = parent;
        this.getTag=function(){
            return '<div class="hero"></div>';
        }
        // this.storeTag=function(){
        //     this.parent.jqEl = $('#'+this.parent.id);
        // } 
        this.updatePosition=function() {
            this.parent.jqEl.css('top', this.parent.posY+'px');
            this.parent.jqEl.css('left', this.parent.posX+'px');
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