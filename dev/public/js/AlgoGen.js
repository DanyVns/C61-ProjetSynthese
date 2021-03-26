class AlgoGen {
    constructor(timeslots, nbUser, fitnessFct, fitnessParam) {
        this.fitness = fitnessFct;
        this.fitnessParam = fitnessParam;    
        this.timeslots = null;
        //var solution = [1,-1,-1,0,-1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1]
        var solution = [2,-1,3,1,0]
        this.fitness(this.fitnessParam, solution);

}}