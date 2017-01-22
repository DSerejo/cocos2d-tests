
var EditorScene = cc.Scene.extend({
    objects:[],
    stopped:true,
    selectedObject:null,
    mousePressed: false,
    selectedNode:null,
    newObjectLayer:null,
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
            {position:cc.p(200,100),width:200,height:150,type:b2_dynamicBody,angle:0,'class':'box',restitution:1},
            {position:cc.p(600,50),width:200,height:50,type:b2_dynamicBody,angle:0,'class':'box',restitution:1},
            //{position:cc.p(175,33),radius:20,type:b2_dynamicBody,angle:0,'class':'wheel'},
            //{position:cc.p(225,33),radius:20,type:b2_dynamicBody,angle:0,'class':'wheel'},
            {position:cc.p(275,33),type:b2_dynamicBody,angle:0,'class':'propulsor'},
            {position:cc.p(125,33),type:b2_dynamicBody,angle:0,'class':'propulsor'},
            {position:cc.p(115,33),type:b2_dynamicBody,radius:5,'class':'pin'},
            {position:cc.p(135,33),type:b2_dynamicBody,radius:5,'class':'pin'},
            {position:cc.p(265,33),type:b2_dynamicBody,radius:5,'class':'pin'},
            {position:cc.p(285,33),type:b2_dynamicBody,radius:5,'class':'pin'},

        ])
        this.scheduleUpdate();
        window.editor = this
    },
    initPhysics : function(){
        //1. new world object
        this.world = new b2World(new b2Vec2(0,-10));
        this.world.stopped = this.stopped
        this.world.SetContinuousPhysics(true);
        var bodyDef = new b2BodyDef();
        bodyDef.position.Set(cc.view.getDesignResolutionSize().width/PMR/2,0);
        this.bodyGround = this.world.CreateBody(bodyDef);
        this.groundShape = new b2PolygonShape();
        this.groundShape.SetAsBox(cc.view.getDesignResolutionSize().width/PMR/2,10/PMR)
        var fixDef = new b2FixtureDef();
        fixDef.shape = this.groundShape;
        fixDef.restitution = 0.5;
        this.bodyGround.CreateFixture(fixDef)
    },
    initObjects:function(listOfObjects){
        var self = this
        listOfObjects.forEach(function(object){
            var newObject = Factory[object.class](self.world,object)
            self.objects.push(newObject)
            newObject.class = object.class
            if(newObject.sprite)
                self.addChild(newObject.sprite,object.class=='pin'?2:0);
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
        this.world.stopped = this.stopped;
    },
    listenEvents:function(){

    },
    onKeyPressed:function(){
        console.log(arguments)
    },
    onKeyReleased:function(){
        console.log(arguments)
    },
    listenEvents: function(){
        var self = this;
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.onMouseMove.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this)
        })
        cc.eventManager.addListener(listener, this);
        cc.eventManager.setPriority(listener,1);
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:function(key,event){
                _.each(self.objects,function(o){
                    o.onKeyPressed && o.onKeyPressed(key,event)
                })
            },
            onKeyReleased:function(key,event){
                _.each(self.objects,function(o){
                    o.onKeyReleased && o.onKeyReleased(key,event)
                })
            }
        },this)
    },
    onMouseDown:function(event){
        if(this.isNewObjectLayerClicked()) return;
        this.mousePressed = true;
        var objects = this.getElementAtMouse(event);
        if(objects.length){
            if(this.controlLayer && this.controlLayer.selectedButton && this.controlLayer.selectedButton.getName()!='Move' && this.selectedObject && this.selectedObject.isTouched(cc.pointFromEvent(event))) return;
            this.showControlLayer()
            this.updateSelectedObject(objects)
            if(this.shouldTransform()){
                this.controlLayer.selectedButton.startTransformation&&this.controlLayer.selectedButton.startTransformation(event,this.selectedObject);
            }
        }else{
            if(!this.isControlLayerClicked(event) && !this.isRotateAction()){
                this.hideControlLayer()
                this.setAllObjectsToInactive()
            }
        }
    },
    shouldTransform:function(){
        return this.mousePressed && this.controlLayer && this.controlLayer.selectedButton && !this.isControlLayerClicked(event)
    },
    isNewObjectLayerClicked:function(){
        return this.newObjectLayer
    },
    isControlLayerClicked:function(event){
        return this.controlLayer && this.rectContainsPoint(this.controlLayer,event)
    },
    isRotateAction:function(){
        return this.controlLayer && this.controlLayer.selectedButton && this.controlLayer.selectedButton._name=="Rotate"
    },
    onMouseUp:function(event){
        if(this.isNewObjectLayerClicked()) return;
        this.mousePressed = false;

    },
    onMouseMove:function(event){
        if(this.isNewObjectLayerClicked()) return;
        if(this.shouldTransform()){
            this.controlLayer.selectedButton.transform(event,this.selectedObject);
        }
    },
    getElementAtMouse:function(event){
        var self = this;
        return _.filter(this.objects,function(o){
            return o.sprite && o.isTouched &&  o.isTouched(cc.pointFromEvent(event)) && o.getName!=EditorScene.Tags.background
        })
    },
    rectContainsPoint:function(object,event){
        return cc.rectContainsPoint(object.getBoundingBoxToWorld(),cc.p(event._x,event._y))
    },
    showControlLayer:function(){
        if(!this.controlLayer){
            this.controlLayer = new ControlLayer();
            this.addChild(this.controlLayer);
        }
        if(!this.controlLayer.selectedButton){
            this.controlLayer.selectedButton = this.controlLayer.moveButton
            this.controlLayer.moveButton.onActive()
        }

    },
    hideControlLayer:function(){
        if(this.controlLayer){
            this.controlLayer.removeFromParent()
            this.controlLayer = null
        }
    },
    updateSelectedObject:function(objects){
        this.selectedObject && this.selectedObject.unSelect()
        this.selectedObject = this.findSelectedObject(objects);
        this.selectedObject.select()

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
        this.selectedObject && this.selectedObject.unSelect()
        this.selectedObject = null

    },
    addNewObject:function(type,options){
        this.newObjectLayer = new NewObjectLayer(this.world,options);
        this.addChild(this.newObjectLayer)
        var self = this;
        this.newObjectLayer.startCreating(type,function(){
            self.initObjects([self.newObjectLayer.objectToJson()]);
            self.newObjectLayer.objectToBeAdded.removeFromParent()
            self.newObjectLayer.removeFromParent()
            self.newObjectLayer = null
        })

    }



});
var NewObjectLayer = cc.Layer.extend({
    callBack:null,
    type:null,
    _mousePressed:false,
    objectToBeAdded:null,
    startedPoint:null,
    world:null,
    options:{},
    ctor:function(world,options){
        this._super()
        this.world = world
        this.options = options
        this.listenEvents()
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
        this._mousePressed = true;
        this.startedPoint = cc.pointFromEvent(event);
    },
    onMouseMove:function(event){
        if(this._mousePressed)
            this.updateObject(event);
    },
    onMouseUp:function(event){
        this._mousePressed = false;
        this.callBack && this.callBack()
    },
    startCreating:function(type,callBack){
        this.callBack = callBack;
        this.type = type;
    },
    updateObject:function(event){
        if(!this.objectToBeAdded){
            this.createObject(event);
            if(this.type=='pin')
                return this.callBack()
        }else{
            this.objectToBeAdded && this.objectToBeAdded.setOptions(this.prepareObjectOptionsFromEvent(event))
            this.objectToBeAdded && this.objectToBeAdded.recreateSprite()
        }



    },
    removeObject:function(){
        if(this.objectToBeAdded){
            this.objectToBeAdded.sprite.removeFromParent();
            delete this.objectToBeAdded;
        }
    },
    createObject:function(event){
        var options = this.prepareObjectOptionsFromEvent(event);
        this.objectToBeAdded = new Factory[this.type](this.world,options)
        this.addChild(this.objectToBeAdded.sprite)
    },
    prepareObjectOptionsFromEvent:function(event){
        return _.extend({},
            this.options,
            this.prepareSize(event),
            {
                position:this.preparePosition(event),
                type:b2_dynamicBody,
                delayedBodyCreation:true,
                delayedPosition:true,
                angle:0
            })
    },
    preparePosition:function(event){
        var currentPos = cc.pointFromEvent(event);
        return cc.p(
            Math.min(this.startedPoint.x,currentPos.x),
            Math.min(this.startedPoint.y,currentPos.y)
        )
    },
    prepareSize:function(event){
        return cc.pToSize(cc.pCompOp(cc.pSub(this.startedPoint,cc.pointFromEvent(event)),Math.abs))
    },
    objectToJson:function(){
        var pos = cc.pAdd(this.objectToBeAdded.sprite.getPosition(),
            cc.pMult(cc.pFromSize(this.objectToBeAdded.sprite.getContentSize()),1/2)
        )
        return _.extend({},this.objectToBeAdded.sprite.getContentSize(),{
            position:pos,
            type:2,
            'class':this.type,
            radius:this.objectToBeAdded.sprite.getContentSize().width/2,
            angle:0
        })
    }

})
EditorScene.Tags = {
    background:"BACKGROUND"
}
