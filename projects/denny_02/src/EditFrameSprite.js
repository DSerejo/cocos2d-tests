
var DashedLineSprite = cc.Sprite.extend({
    _dashArray:null,
    _startX:null,
    _endX:null,
    _startY:null,
    _endY:null,
    ctor:function (startX,startY,endX,endY,dashArray)
    {
        this._super();

        this._startX= startX
        this._startY =startY;
        this._endX =  endX ;
        this._endY =endY ;
        if (!dashArray)
        {
            this._dashArray=[3,3];
        }
        else
        {
            this._dashArray=dashArray;
        }
        this.drawNode = new cc.DrawNode();
        this.addChild(this.drawNode);
        this.draw();
    },
    draw:function () {

        var x=this._startX;
        var y=this._startY;
        var x2=this._endX;
        var y2=this._endY;
        var toX = this._startX,
            toY = this._startY


        if (dashLength==0)
        {
            dashLength = 0.001;
        } // Hack for Safari
        var dashCount = this._dashArray.length;


        var dx = (x2-x), dy = (y2-y);
        var slope = dy/dx;
        var distRemaining = Math.sqrt( dx * dx + dy * dy );
        var dashIndex=0, draw=true;
        var xStep,yStep;
        while (distRemaining>=0.1)
        {
            var dashLength = this._dashArray[dashIndex++ % dashCount];
            if (dashLength > distRemaining)
            {
                dashLength = distRemaining;
            }
            if(slope!==Infinity && slope!=0){
                xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
            }else{
                xStep = slope==Infinity?0:dashLength;
                yStep = slope==Infinity?dashLength:0;
            }

            if (dx<0)
            {
                xStep = -xStep;
            }
            toX += xStep
            toY += slope==Infinity || slope==0?yStep:slope*xStep;
            if (draw)
            {
                this.drawNode.drawSegment(cc.p(x,y), cc.p(toX,toY),0.5,new cc.Color(0,0,0));
                x = toX;
                y = toY;

            }
            else
            {
                x = toX;
                y = toY;
            }
            distRemaining -= dashLength;
            draw = !draw;
        }
    }
});
var EditFrameSprite = cc.Sprite.extend({
    points:{},
    ctor:function(){
        this._super();
    },
    createForSprite:function(sprite){
        var size = sprite.getContentSize();
        size.width*=sprite.getScaleX();
        size.height*=sprite.getScaleY();
        var centerPos = sprite.getPosition();
        var rotation = sprite.getRotation();
        this.create(size,centerPos);
        this.setRotation(rotation);
    },
    create:function(size,centerPos){
        this.setPosition(centerPos);
        rect = {};
        rect.left = new DashedLineSprite(-size.width/2,-size.height/2,-size.width/2,+size.height/2);
        rect.bottom = new DashedLineSprite(-size.width/2,-size.height/2,+size.width/2,-size.height/2);
        rect.right = new DashedLineSprite(+size.width/2,-size.height/2,+size.width/2,+size.height/2);
        rect.top = new DashedLineSprite(-size.width/2,+size.height/2,+size.width/2,+size.height/2);
        for(var i in rect){
            this.addChild(rect[i]);
        }

        var bottomleft = cc.p(-size.width/2,-size.height/2);
        var topleft = cc.p(-size.width/2,size.height/2);
        var topright = cc.p(size.width/2,size.height/2);
        var bottomright = cc.p(size.width/2,-size.height/2);

        this.points.bottomleft = this.createControlPoint(bottomleft);
        this.points.topleft = this.createControlPoint(topleft);
        this.points.topright = this.createControlPoint(topright);
        this.points.bottomright = this.createControlPoint(bottomright);

    },
    createControlPoint:function(pos){
        var sprite = new cc.Sprite();
        var d = new cc.DrawNode();
        sprite.addChild(d);
        d.drawPoly([
                cc.p(-1,-1),
                cc.p(-1,1),
                cc.p(1,1),
                cc.p(1,-1)
            ],
            cc.color(64,199,207),
            1,
            cc.color(64,199,207)
        )
        sprite.setPosition(pos)
        this.addChild(sprite);
        return sprite;
    }
})