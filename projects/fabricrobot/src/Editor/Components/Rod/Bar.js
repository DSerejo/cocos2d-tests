var Bar = cc.Node.extend({
    dn:null,
    config:{
        height:3
    },
    start:null,
    end:null,
    ctor:function(start,end,config){
        this._super()
        _.extend(this.config,config);
        this.dn = new cc.DrawNode()
        this.addChild(this.dn)
        this.start = start;
        this.end = end;
        this.draw(start,end)
    },
    draw:function(start,end){
        var distance = this._pointDistance(start,end);
        this._contentSize = cc.size(distance,this.config.height)
        this.setAnchorPoint(cc.p(0,0.5))
        this.dn.drawRect(cc.p(0,0), cc.p(distance,this.config.height), cc.color("#EFEFEF"), 1, cc.color("#6D6D6D"));

        this.calcRotation(start,end)
    },
    _pointDistance:function(start,end){
        return Math.sqrt(Math.pow((start.x - end.x),2) + Math.pow((start.y - end.y),2))
    },
    getHeight:function(){
        return this.config.height
    },
    calcRotation:function(start,end){
        start = start || this.start
        end = end || this.end
        var a=start.x>end.x?end:start,
            b=start.x>end.x?start:end,
            beginLineA = a,
            endLineA = cc.p(b.x,a.y),
            beginLineB = a,
            endLineB = b,
            angle = cc.angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(beginLineA,endLineA,beginLineB,endLineB)
        if(start.x>end.x){
            angle = 180 - angle
        }else{
            angle = -angle;
        }
        return angle
    }
})