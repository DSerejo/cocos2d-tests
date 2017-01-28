var Material = cc.Class.extend({
    density:1,
    friction:1,
    restitution:0,
    fillColor:'#ffffff',
    fakeYoungModulus:1,
    fakeYieldStrength:1,
    fakeFractionStrain:1,
    imaginaryEnergyAbsorptionRate:1,
    fixtureOptions: function(){
        return {
            density:this.density,
            friction:this.friction,
            restitution:this.restitution,
            fillColor:this.fillColor,
        }
    },
    getFakePlasticDefModulus:function(){
        return this.fakeYoungModulus*0.2
    },
    /**
     * Calculates the fake deformation ratio for a given absorbed energy per area
     * being 0 = elastic deformation and 1 = fracture
     * @param  {Number} absorbedEnergyPerArea
     * @return {Number}
     */
    calculateDeformationRatio:function(absorbedEnergyPerArea){
        var deformationEnergy,
            deformation;
        if(absorbedEnergyPerArea<this.fakeYieldStrength)
            return 0;
        deformationEnergy = absorbedEnergyPerArea - this.fakeYieldStrength;
        deformation = deformationEnergy * this.getFakePlasticDefModulus();
        
        //return Math.min(deformation/this.fakeFractionStrain,1);
        return deformation/this.fakeFractionStrain;
    },
    /**
     * Calculates the imaginary energy absorbed
     * being 0 = elastic deformation and 1 = fracture
     * @param  {Number} energyPerArea
     * @return {Number}
     */
    calculateAbsorbedEnergy:function(energyPerArea){
        return energyPerArea*this.imaginaryEnergyAbsorptionRate;
    }

})
var Rubber = Material.extend({
    name:'rubber',
    density:1.2,
    friction:1,
    restitution:1,
    fillColor:'#000000',
    fakeYoungModulus:0.2,
    fakeYieldStrength:250,
    fakeFractionStrain:125,
    imaginaryEnergyAbsorptionRate:1
});


var Steel = Material.extend({
    name:'steel',
    density:7,
    friction:0.3,
    restitution:0.3,
    fillColor:'#EFEFEF',
    fakeYoungModulus:0.7,
    fakeYieldStrength:400,
    fakeFractionStrain:200,
    imaginaryEnergyAbsorptionRate:1
});


var Wood = Material.extend({
    name:'wood',
    density:0.3,
    friction:0.6,
    restitution:0.2,
    fillColor:'#967a1f',
    fakeYoungModulus:1,
    fakeYieldStrength:40,
    fakeFractionStrain:20,
    imaginaryEnergyAbsorptionRate:1
});


var Materials = {
    rubber:function(){return new Rubber()},
    metal:function(){return new Steel()},
    wood:function(){return new Wood()}
}
