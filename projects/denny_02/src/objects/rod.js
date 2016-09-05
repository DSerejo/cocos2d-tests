var Rod = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    h:3,
    jointR:5,
    m:1,
    joints:{},
    _className:'dgRod',

    /** Constructor
     * @param {cp.Space} space
     * @param {cc.p} pos
     * @param {int} width
     */
    ctor:function (space, pos,width) {

        this.space = space;


        var height = this.h;

        this.sprite = new cc.PhysicsSprite(s_block);
        var contentSize = this.sprite.getContentSize()
        this.sprite.setScaleX(width/contentSize.width);
        this.sprite. setScaleY(height/contentSize.height);

        this.body = new cp.Body(this.m, cp.momentForPoly(this.m, [0,height,width,height,width,0,0,0],cp.v(-width/2,-height/2)));
        this.body.setPos(pos)
        this.space.addBody(this.body);

        this.shape = new cp.PolyShape(this.body,[0,height,width,height,width,0,0,0],cp.v(-width/2,-height/2));
        this.shape.setCollisionGroup(3);

        //Sensors only call collision callbacks, and never generate real collisions
        this.shape.setSensor(false);
        this.shape.setFriction(1);
        this.space.addShape(this.shape);
        this.sprite.setBody(this.body);
        this.addJoints();



    },
    createJoint:function(pos){
        var joint = {}
        joint.sprite = new cc.PhysicsSprite(s_joint);
        var contentSize = joint.sprite.getContentSize()
        joint.sprite.setScaleX(this.jointR*2/contentSize.width);
        joint.sprite. setScaleY(this.jointR*2/contentSize.height);

        joint.body = new cp.Body(this.m, cp.momentForCircle(this.m,this.jointR,this.jointR ,cp.vzero));
        joint.body.setPos(pos)
        this.space.addBody(joint.body);
        joint.shape = new cp.CircleShape(joint.body,this.jointR,cp.vzero);
        joint.shape.setCollisionGroup(3);
        //Sensors only call collision callbacks, and never generate real collisions
        joint.shape.setSensor(false);
        joint.shape.setFriction(1);
        this.space.addShape(joint.shape);
        joint.sprite.setBody(joint.body);

        return joint;
    },
    addJoints:function(){
        var rect = this.sprite.getBoundingBox();
        var pos = this.sprite.getPosition();
        var angle = this.sprite.getRotation();
        var v = cp.v.forangle(angle*Math.PI/180);

        this.joints.left = this.createJoint(cp.v.add(pos,cp.v.mult(v,-rect.width/2)));
        this.joints.right = this.createJoint(cp.v.add(pos,cp.v.mult(v,rect.width/2)));

        var leftPin = new cp.PivotJoint(this.body,this.joints.left.body,cp.v(-rect.width/2,0),cp.vzero);
        var rightPin = new cp.PivotJoint(this.body,this.joints.right.body,cp.v(rect.width/2,0),cp.vzero);

        this.space.addConstraint(leftPin);
        this.space.addConstraint(rightPin);
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
            leftJoint: this.joints.left.sprite,
            rightJoint:this.joints.right.sprite,
            stick: this.sprite
        }
    },
    getObjects:function(){
        return {
            leftJoint: this.joints.left.sprite,
            rightJoint:this.joints.right.sprite,
            stick: this
        }
    },
});