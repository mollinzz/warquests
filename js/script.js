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

function Stage(selector){
    this.jqEl = $(selector);
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