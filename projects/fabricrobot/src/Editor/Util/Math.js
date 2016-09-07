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
cc.convertPointToMeters = function(p){
    return cc.pMult(p,1/PMR)
}

