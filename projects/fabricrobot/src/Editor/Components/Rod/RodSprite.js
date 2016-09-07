var RodSprite = cc.Node.extend({
    con1:null,
    con2:null,
    bar:null,
    ctor:function(options,parent){
        this._super();
        this.parentBody = parent
        this.con1 = this.addConnection();
        this.con2 = this.addConnection();
        this.positionConnection(this.con1,true,options['con1']);
        this.positionConnection(this.con2,false,options['con2']);
        this.addBar();

        this._anchorPoint = cc.p(0.5,0.5)
    },
    addConnection:function(){
        var con = new RodConnection();
        this.addChild(con);
        con.zIndex =1
        con.init()
        return con;
    },
    positionConnection:function(con,start,conOptions){
        var position;
        if(conOptions){
            position = conOptions.position;
        }else{
            var x=30 * (start?-1:1);
            position = cc.p(x,start?-10:10);
        }
        con.setPosition(position);
    },
    addBar:function(){
        this.bar = new Bar(this.con1.getPosition(),this.con2.getPosition());
        this.addChild(this.bar);
        this.bar.zIndex = 0;
        window.bar = this.bar;
        this.positionBar();

    },
    drawBar:function(){
        if(this.bar)
            this.removeChild(this.bar);
        this.addBar();
        if(this.parentBody)
            this.parentBody.updateShape();
    },
    positionBar:function(){
        this.bar.setPosition(this.con1.getPosition());
    },
    getPosition:function(){
        if(this.bar){
            var box = this.bar.getBoundingBoxToWorld();
            return {
                x:box.x + box.width/2,
                y:box.y + box.height/2
            }
        }
        else
            return this._super();
    },
    getRotation:function(){

    }



})