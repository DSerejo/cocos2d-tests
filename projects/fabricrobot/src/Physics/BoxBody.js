var BoxBody = PhysicsObject.extend({
    makeBody: function(width,height,bodyType,density,restitution,friction,pos,angle){
        var bodyDef = new b2BodyDef();
        bodyDef.type = bodyType;
        bodyDef.position.Set(pos.x/this.PMR, pos.y/this.PMR);
        bodyDef.angle = cc.degreesToRadians(angle);
        this.body = this.world.CreateBody(bodyDef);
        this.shape = new b2PolygonShape();
        width=width/2;
        height=height/2;
        this.shape.SetAsBox(width/this.PMR,height/this.PMR)
        var fixDef = new b2FixtureDef();
        fixDef.shape=this.shape;
        fixDef.density=density;
        fixDef.friction=friction;
        fixDef.restitution = restitution;
        this.body.CreateFixture(fixDef);
    },
})