var Motor = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    m:1,
    r:15,
    acc:1,
    topSpeed:10,
    _className:'dgMotor',

    /** Constructor
     * @param {cp.Space} space
     * @param {cc.p} pos
     * @param {int} width
     * @param {int} height
     */
    ctor:function (space, pos) {

        this.space = space;

        this.addMotor(pos)
        this.frame = this.addFrame(cc.p(pos.x,pos.y));

        var constraint = new cp.PivotJoint(this.body,this.frame.body,cp.vzero,cp.vzero);
        this.space.addConstraint(constraint);

        this.unsetCollisionGroup();

    },
    getShape:function () {
        return this.shape;
    },
    getSprites:function(){
        var sprites = {
            frame: this.frame.sprite,
            gear: this.sprite
        };
        if(this.editFrame){
            sprites.editFrame=this.editFrame
        }
        return sprites;
    },
    getObjects:function(){
        return {
            frame: this.frame,
            gear: this
        }
    },
    accelerate:function(inverse){
        var vel = this.body.w;
        if(inverse){
            this.body.setAngVel(Math.min(vel+this.acc/2,this.topSpeed/2));
        }else{
            this.body.setAngVel(Math.max(vel-this.acc,-this.topSpeed));
        }

    },
    break:function(){

        var vel = this.body.w;
        if(vel< -0.01){
            this.body.setAngVel(Math.min(vel+this.acc*3,0));
        }else{
            this.accelerate(true);
        }

    },
    setCollisionGroup:function(group){
        this.shape.setCollisionGroup(group);
        this.frame.shape.setCollisionGroup(group);
    },
    unsetCollisionGroup:function(){
        this.setCollisionGroup(this.__instanceId);
    },
    addMotor:function(pos){
        this.sprite = new cc.PhysicsSprite(s_gear);
        var contentSize = this.sprite.getContentSize()
        this.sprite.setScaleX(this.r*2/contentSize.width);
        this.sprite. setScaleY(this.r*2/contentSize.height);

        this.body = new cp.Body(this.m, cp.momentForCircle(this.m,this.r,this.r ,cp.vzero));
        this.body.setPos(pos)
        this.space.addBody(this.body);
        this.shape = new cp.CircleShape(this.body,this.r,cp.vzero);

        this.shape.setSensor(false);
        this.shape.setFriction(1);
        this.space.addShape(this.shape);
        this.sprite.setBody(this.body);


    },
    addFrame:function(pos){
        var frame = {};
        frame.r = this.r + 2;
        frame.sprite = new cc.PhysicsSprite(s_motor_frame);
        var contentSize = frame.sprite.getContentSize()
        frame.sprite.setScaleX(frame.r*2/contentSize.width);
        frame.sprite. setScaleY(frame.r*2/contentSize.height);

        frame.body = new cp.Body(this.m, cp.momentForBox(this.m,frame.r*2,frame.r*2 ));
        frame.body.setPos(pos)
        this.space.addBody(frame.body);
        frame.shape = new cp.BoxShape(frame.body,frame.r*2,frame.r*2);
        frame.shape.setCollisionGroup(3);
        frame.shape.setFriction(0.2);
        this.space.addShape(frame.shape);
        frame.sprite.setBody(frame.body);
        return frame;
    },
    removeFromParent:function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    }



});