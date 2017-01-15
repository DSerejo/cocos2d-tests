if(typeof Utility == "undefined") {
var Utility = {
    addFrame:function(obj,sprite){
        var frame = new EditFrameSprite();
        frame.createForSprite(sprite);
        if(obj.editFrame) return;
        sprite.getParent().addChild(frame);
        obj.editFrame = frame;
    }
}}