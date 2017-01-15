var ScaleButtonBase = ControlButton.extend({
    getDeltaScale:function(event,object,max){
        if(max){
            var curPos = cc.p(event._x,event._y),
                prevPos = cc.p(event._prevX,event._prevY),
                objectCenter = object.getPosition(),
                curLength = cc.pLength(cc.pSub(curPos,objectCenter)),
                prevLength = cc.pLength(cc.pSub(prevPos,objectCenter))
            return cc.p(curLength-prevLength,curLength-prevLength)
        }
        return cc.p(event._x-event._prevX,event._y - event._prevY)
    },
    scaleX:function(event,object,max){
        var dScale = this.getDeltaScale(event,object.sprite,max),
            newScale = object.sprite.getScaleX() + dScale.x/100,
            newWidth = object.sprite.getBoundingBoxToWorld().width/object.sprite.getScaleX() * newScale;
        if(newWidth<=10)
            return;
        object.sprite.setScaleX(newScale)
    },
    scaleY:function(event,object,max){
        var dScale = this.getDeltaScale(event,object.sprite,max),
            newScale = object.sprite.getScaleY() + dScale.y/100,
            newHeight = object.sprite.getBoundingBoxToWorld().height/object.sprite.getScaleY() * newScale;
        if(newHeight<=10)
            return;
        object.sprite.setScaleY(newScale)
    }
})
var ScaleXButton = ScaleButtonBase.extend({
    fillColor:"#42b9f4",
    fileName:'ExpandH',
    transform:function(event,object){
        this.scaleX(event,object);
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    }


})
var ScaleYButton = ScaleButtonBase.extend({
    fillColor:"#42b9f4",
    fileName:'ExpandV',
    transform:function(event,object){
        this.scaleY(event,object);
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    },
})
var ScaleButton = ScaleButtonBase.extend({
    fillColor:"#42b9f4",
    fileName:'Expand',

    transform:function(event,object){
        this.scaleX(event,object,true);
        this.scaleY(event,object,true);
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    },

})
