var AnimationLayer = cc.Layer.extend({
    _debugNode:null,
    space : null,
    objects:[],
    dragging:null,
    ctor:function(space){
        this._super();
        this.space=space;
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild(this._debugNode, 10);
    },

    init:function () {

        this._super();
        var size = cc.director.getWinSize();
        this.hero = new Hero(this.space,cc.p(size.width / 2, 70));
        this.addChild(this.hero.sprite);
        this.objects.push(this.hero);

        var rock = new Rock(this.space,cc.p(size.width /2 + 20, 70),60,60);
        this.addChild(rock.sprite);
        this.objects.push(rock);

        var constraint = new cp.PinJoint(this.hero.body,rock.body,cp.vzero,cp.vzero);
        this.space.addConstraint(constraint);


        var rod = new Rod(this.space,cc.p(size.width /2 + 30, 70),60,60);
        this.addChild(rod.sprite);
        this.objects.push(rod);

        rock.shape.setCollisionGroup(1);
        this.hero.shape.setCollisionGroup(1);


        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.onMouseDown,
            onMouseMove: this.onMouseMove,
            onMouseUp: this.onMouseUp
        }, this)
    },
    onMouseDown: function(target,event){
        var self = target.getCurrentTarget();
        for(var i in self.objects){
            var obj = self.objects[i];
            var point = cc.p(target._x,target._y);
            if(cc.rectContainsPoint(obj.sprite.getBoundingBox(),point)){
                cc.log('==clicked obj')
                self.dragging = obj;
            }
            else{
                cc.log('==clicked world')
            }
        }
    },
    onMouseMove: function(target,event){
        var self = target.getCurrentTarget();
        if(self.dragging){
            self.space.gravity = cp.vzero;
            cc.log(target._x,target._y);
            var action = cc.moveBy(0,target.getDelta());
            self.dragging.sprite.runAction(action);
        }
    },
    onMouseUp: function(target,event){
        var self = target.getCurrentTarget();
        if(self.dragging){
            self.space.gravity = cp.v(0, -350);
            cc.log('==drag ends')
        }
        self.dragging = null;
    }

});

