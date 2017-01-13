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
    getScaleDirection:function(event,object){
        var dAngle = cc.radiansToDegrees(cc.pToAngle(cc.pSub(cc.p(event._x,event._y),cc.p(event._prevX,event._prevY)))),
            angleRelativeToCenter = cc.radiansToDegrees(cc.pToAngle(cc.pSub(cc.p(event._x,event._y),object.getPosition()))),
            dAngleQuad = this.getQuad(dAngle),
            relAngleQuad = this.getQuad(angleRelativeToCenter)

        if(
            (relAngleQuad==1&&dAngleQuad==3) ||
            (relAngleQuad==2&&dAngleQuad==4) ||
            (relAngleQuad==3&&dAngleQuad==1) ||
            (relAngleQuad==4&&dAngleQuad==2)
        ){
            return -1;
        }
        return 1
    },
    curMoveDirection:function(event){

    },
    getQuad:function(angle){
        if(angle>=0 && angle<90) return 1;
        if(angle>=90 && angle<180) return 2;
        if(angle>=-180 && angle<-90) return 3;
        if(angle>=-90 && angle<0) return 4;

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
    onActive:function(){
        console.log('Scale x')
    },
    onInactive:function(){
        console.log('Stop Scale x')
    },
    transform:function(event,object){
        this.scaleX(event,object);
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    }
})
var ScaleYButton = ScaleButtonBase.extend({
    fillColor:"#42b9f4",
    onActive:function(){
        console.log('Scale y')
    },
    onInactive:function(){
        console.log('Stop Scale y')
    },
    transform:function(event,object){
        this.scaleY(event,object);
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    }
})
var ScaleButton = ScaleButtonBase.extend({
    fillColor:"#42b9f4",
    onActive:function(){
        console.log('Scale xy')
    },
    onInactive:function(){
        console.log('Stop Scale xy')
    },
    transform:function(event,object){
        this.scaleX(event,object,true);
        this.scaleY(event,object,true);
        object.updateBodyFromSprite && object.updateBodyFromSprite()
    }
})
