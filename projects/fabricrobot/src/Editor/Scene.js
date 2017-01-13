
var EditorScene = cc.Scene.extend({
    objects:[],
    stopped:true,
    selectedObject:null,
    mousePressed: false,
    onEnter:function () {
        this._super();
        var background = new cc.LayerColor(cc.color(255,255,255));

        this.initPhysics();
        this.listenEvents();
        this.debugDraw();
        this.addChild(background,-1,EditorScene.Tags.background);
        this.worldLayer = new WorldLayer(this.world);
        //this.addTestSprite({position:cc.p(400,0),type:b2_staticBody,con1:{position: cc.p(-400,0)},con2:{position: cc.p(400,0)}});
        this.initObjects([
            {position:cc.p(250,300),width:100,height:100,type:b2_dynamicBody,radius:10,'class':'box'},
            {position:cc.p(300,300),width:100,height:100,type:b2_dynamicBody,radius:10,'class':'box'},
            {position:cc.p(300,300),type:b2_dynamicBody,radius:10,'class':'wheel'},
        ])
        this.scheduleUpdate();
        window.editor = this
    },
    initPhysics : function(){
        //1. new world object
        this.world = new b2World(new b2Vec2(0,-10));
        this.world.SetContinuousPhysics(true);
        var bodyDef = new b2BodyDef();
        bodyDef.position.Set(cc.view.getDesignResolutionSize().width/PMR/2,0);
        this.bodyGround = this.world.CreateBody(bodyDef);
        this.groundShape = new b2PolygonShape();
        this.groundShape.SetAsBox(cc.view.getDesignResolutionSize().width/PMR/2,10/PMR)
        var fixDef = new b2FixtureDef();
        fixDef.shape = this.groundShape;
        this.bodyGround.CreateFixture(fixDef)
    },
    initObjects:function(listOfObjects){
        var self = this
        listOfObjects.forEach(function(object){
            var newObject = Factory[object.class](self.world,object)
            self.objects.push(newObject)
            if(newObject.sprite)
                self.addChild(newObject.sprite);
        })
    },
    update:function(dt){
        this.world.DrawDebugData();
        if(this.stopped) return;
        this.world.Step(1/60,10,10);
        this.world.ClearForces();
        this.objects.forEach(function(o){
            o.update(dt)
        })
    },
    debugDraw:function(){
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("box2d").getContext("2d"));
        debugDraw.SetDrawScale(30);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    },
    togglePhysics:function(){
        this.stopped = !this.stopped;
    },
    listenEvents: function(){
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.onMouseMove.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this)
        })
        cc.eventManager.addListener(listener, this);
        cc.eventManager.setPriority(listener,1);
    },
    onMouseDown:function(event){
        this.mousePressed = true;
        var objects = this.getElementAtMouse(event);
        if(objects.length){
            if(this.controlLayer && this.controlLayer.selectedButton && this.selectedObject && this.rectContainsPoint(this.selectedObject.sprite,event)) return;
            this.showControlLayer()
            this.updateSelectedObject(objects)
        }else{
            if(!this.isControlLayerClicked(event) && !this.isRotateAction()){
                this.hideControlLayer()
                this.setAllObjectsToInactive()
            }
        }
    },
    isControlLayerClicked:function(event){
        return this.controlLayer && this.rectContainsPoint(this.controlLayer,event)
    },
    isRotateAction:function(){
        return this.controlLayer && this.controlLayer.selectedButton && this.controlLayer.selectedButton._name=="Rotate"
    },
    onMouseUp:function(event){
        this.mousePressed = false;
    },
    onMouseMove:function(event){
        if(this.mousePressed && this.controlLayer && this.controlLayer.selectedButton && !this.isControlLayerClicked(event)){
            this.controlLayer.selectedButton.transform(event,this.selectedObject);
        }
    },
    getElementAtMouse:function(event){
        var self = this;
        return _.filter(this.objects,function(o){
            return o.sprite && self.rectContainsPoint(o.sprite,event) && o.getName!=EditorScene.Tags.background
        })
    },
    rectContainsPoint:function(object,event){
        return cc.rectContainsPoint(object.getBoundingBoxToWorld(),cc.p(event._x,event._y))
    },
    showControlLayer:function(){
        if(!this.controlLayer){
            this.controlLayer = new ControlLayer(); this.addChild(this.controlLayer);
        }

    },
    hideControlLayer:function(){
        if(this.controlLayer){
            this.controlLayer.removeFromParent()
            this.controlLayer = null
        }
    },
    updateSelectedObject:function(objects){
        this.selectedObject = this.findSelectedObject(objects);
        this.reorderChild(this.selectedObject.sprite,1);
    },
    findSelectedObject:function(objects){
        if(!this.selectedObject){
            return objects[0];
        }
        var self = this
        var index = _.findIndex(objects,function(o){return o==self.selectedObject})
        if(index == -1 || index == objects.length-1) return objects[0];
        return objects[index+1];
    },
    setAllObjectsToInactive:function(){
        this.selectedObject = null
    },



});

function init() {
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2AABB = Box2D.Collision.b2AABB;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2World = Box2D.Dynamics.b2World;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    var worldScale = 30;

    var world = new b2World(new b2Vec2(0, 10),true);

    var canvasPosition = getElementPosition(document.getElementById("box2d"));

    debugDraw();
    window.setInterval(update,1000/60);

    createBox(640,30,320,480,b2Body.b2_staticBody);
    createBox(640,30,320,0,b2Body.b2_staticBody);
    createBox(30,480,0,240,b2Body.b2_staticBody);
    createBox(30,480,640,240,b2Body.b2_staticBody);

    document.addEventListener("mousedown",function(e){
        createBox(Math.random()*40+40,Math.random()*40+40,e.clientX-canvasPosition.x,e.clientY-canvasPosition.y,b2Body.b2_dynamicBody);
    });

    function createBox(width,height,pX,pY,type){
        var bodyDef = new b2BodyDef;
        bodyDef.type = type;
        bodyDef.position.Set(pX/worldScale,pY/worldScale);
        var polygonShape = new b2PolygonShape;
        polygonShape.SetAsBox(width/2/worldScale,height/2/worldScale);
        var fixtureDef = new b2FixtureDef;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;
        var body=world.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);
    }

    function debugDraw(){
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("box2d").getContext("2d"));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    }

    function update() {
        world.Step(1/60,10,10);
        world.DrawDebugData();
        world.ClearForces();
    };

    //http://js-tut.aardon.de/js-tut/tutorial/position.html
    function getElementPosition(element) {
        var elem=element, tagname="", x=0, y=0;
        while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
            y += elem.offsetTop;
            x += elem.offsetLeft;
            tagname = elem.tagName.toUpperCase();
            if(tagname == "BODY"){
                elem=0;
            }
            if(typeof(elem) == "object"){
                if(typeof(elem.offsetParent) == "object"){
                    elem = elem.offsetParent;
                }
            }
        }
        return {x: x, y: y};
    }

};
EditorScene.Tags = {
    background:"BACKGROUND"
}
