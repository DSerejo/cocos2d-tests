var Transmission = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    h:3,
    m:1,
    _className:'dgTransmission',

    /** Constructor
     * @param {cp.Space} space

     * @param {int} motor
     * @param {int} wheel
     */
    ctor:function (space,motor,wheel) {

        this.space = space;
        var motorP = motor.sprite.getPosition();
        var wheelP = wheel.sprite.getPosition();
        var diff = cp.v.sub(wheelP,motorP);
        var width = cp.v.len(diff);
        var height = this.h;
        var angle = cp.v.toangle(diff);
        var norm = cp.v.normalize(diff);
        var pos = cp.v.add(motorP,cp.v.mult(norm,width/2));


        this.sprite = new cc.PhysicsSprite(s_block);
        var contentSize = this.sprite.getContentSize()
        this.sprite.setScaleX(width/contentSize.width);
        this.sprite. setScaleY(height/contentSize.height);
        this.body = new cp.Body(this.m, cp.momentForPoly(this.m, [0,height,width,height,width,0,0,0],cp.v(-width/2,-height/2)));
        this.body.setPos(pos);
        this.space.addBody(this.body);
        this.shape = new cp.PolyShape(this.body,[0,height,width,height,width,0,0,0],cp.v(-width/2,-height/2));
        this.shape.setCollisionGroup(3);
        this.shape.setSensor(true);
        this.shape.setFriction(1);
        this.space.addShape(this.shape);
        this.sprite.setBody(this.body);
        this.sprite.setRotation(-angle*180/Math.PI);


        var simpleMotor = new cp.GearJoint(motor.body,wheel.body,1,1);
        this.space.addConstraint(simpleMotor);
        this.joint = simpleMotor;
        var constraint = new cp.PinJoint(motor.body,wheel.body,cp.vzero,cp.vzero);
        this.space.addConstraint(constraint);

        var wheelPin = new cp.PivotJoint(wheel.body,this.body,cp.vzero,cp.v(width/2,0));
        this.space.addConstraint(wheelPin);

        var motorPin = new cp.PivotJoint(motor.body,this.body,cp.vzero,cp.v(-width/2,0));
        this.space.addConstraint(motorPin);



    },

    removeFromParent:function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    getShape:function () {
        return this.shape;
    },
    getSprites:function(){
        return {
            stick: this.sprite
        }
    },
    getObjects:function(){
        return {
            stick: this
        }
    },
});