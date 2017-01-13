var MoveButton = ControlButton.extend({
    fillColor:"#CCCCCC",
    getDeltaPosition:function(event){
        return cc.p(event._x-event._prevX,event._y - event._prevY)
    },
    onActive:function(){
        console.log('Move')
    },
    onInactive:function(){
        console.log('Stop move')
    },
    transform:function(event,object){
        this.move(event,object)
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    },
    move:function(event,object){
        var dPos = this.getDeltaPosition(event),
            curPos = object.sprite.getPosition()
        object.sprite.setPosition(cc.p(curPos.x+dPos.x,curPos.y+dPos.y))
    }
})