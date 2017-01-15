// collision type for chipmunk
var guid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.hero = 1;
    SpriteTag.rock = 2;
};
if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.background = 0;
    TagOfLayer.Animation = 1;
    TagOfLayer.Status = 2;
};
if(typeof GameState == "undefined") {
    var gameState =function(){
        this.stopped = 1;
        this.running = 2;
        this.adding = '';
        this.current = this.stopped
    }
    gameState.prototype.changeState = function(newState){
        this.prevState = GameState.current;
        this.current = newState;

    }
    var GameState = new gameState();
};
