cc.angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint = function (beginLineA, endLineA, beginLineB, endLineB) {
    var a = endLineA.x - beginLineA.x;
    var b = endLineA.y - beginLineA.y;
    var c = endLineB.x - beginLineB.x;
    var d = endLineB.y - beginLineB.y;

    var atanA = Math.atan2(a, b);
    var atanB = Math.atan2(c, d);

    // convert radiants to degrees
    return (atanA - atanB) * 180 / Math.PI;
}
cc.distanceFromPointToLine = function(p,line){
    var x0 = p.x,
        y0 = p.y,
        x1 = line.p1.x,
        y1 = line.p1.y,
        x2 = line.p2.x,
        y2 = line.p2.y;
    return Math.abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1) / Math.sqrt(Math.pow(y2-y1,2)+Math.pow(x2-x1,2))
}
cc.convertPointToMeters = function(p){
    return cc.pMult(p,WORLD_SCALE/PMR)
}
cc.convertMetersToPoint = function(p){
    return cc.pMult(p,PMR/WORLD_SCALE)
}
cc.angleInRadiansBetweenToPoints = function(p1,p2){
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}
cc.pointFromEvent = function(event){
    return cc.p(event._x,event._y)
}
cc.prevPointFromEvent = function(event){
    return cc.p(event._prevX,event._prevY)
}

cc.pToSize = function(p){
    return {
        width: p.x,
        height: p.y
    }
}
cc.aux = function(){
    var bA,
        bB,
        manifold,
        bbA,
        bbB,
        collisionWorldPoint,
        p1,
        p2
    bA = editor.worldLayer.getBodyWithId(4)
    bB = editor.worldLayer.getBodyWithId(3)
    manifold = new b2Manifold()
    Box2D.Collision.b2Collision.CollidePolygons(manifold,bA.m_fixtureList.m_shape,bA.m_xf,bB.m_fixtureList.m_shape,bB.m_xf)
    if(manifold.m_type == Box2D.Collision.b2Manifold.e_faceA){
        bbA=bA
        bbB=bB
    }else{
        bbA=bB
        bbB=bA
    }
    collisionWorldPoint = bbA.GetWorldPoint(manifold.m_points[0].m_localPoint)
    if(manifold.m_localPoint.x==0){
        p1 = new b2Vec2(manifold.m_localPoint.y,manifold.m_localPoint.y)
        p2 = new b2Vec2(-manifold.m_localPoint.y,manifold.m_localPoint.y)
    }else{
        p1 = new b2Vec2(manifold.m_localPoint.x,manifold.m_localPoint.x)
        p2 = new b2Vec2(manifold.m_localPoint.x,-manifold.m_localPoint.x)
    }

}