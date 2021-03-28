class AlgoGen {
    constructor(nbGene, etendueGene, taillePop, ratioMutation, nbElite,
        selection, crossover, mutation, fitnessFct, fitnessParam) {
        this.fitness = fitnessFct;
        this.fitnessParam = fitnessParam;
        this.nbGene = nbGene;
        this.etendueGene = etendueGene;
        this.population = taillePop;
        this.ratioMutation = ratioMutation
        this.nbElite = nbElite;
        this.selection = new SelectionStrategy(selection)
        this.crossover = new CrossoverStrategy(crossover)
        this.mutation = new MutationStrategy(mutation)


        //var solution = [1,-1,-1,0,-1,-1,-1,-1,-1,-1, -1,-1,-1,-1,-1]
        var solution = [2, -1, 3, 1, 0]
        //this.fitness(this.fitnessParam, solution);


    }
}


/********************SELECTION****************** */

class SelectionStrategy {
    constructor(strategy) {
        this.name = "parent"
        this.strategy = null;
        if (strategy == "roulette")
            this.strategy = new RouletteSelectionStrategy()
        else if (strategy == "tournament")
            this.strategy = new TournamentSelectionStrategy()
    }

    distonnom() {
        this.strategy.distonnom()
    }

    
    select(solution) {
        return this.strategy.select(solution)
    }
}

class RouletteSelectionStrategy extends SelectionStrategy {
    constructor() {
        super()
        this.name = "Roulette"
    }
    distonnom() {
        console.log(this.name);
    }

    
    select(solution) {
        return 1
    }
}

class TournamentSelectionStrategy extends SelectionStrategy {
    constructor() {
        super()
        this.name = "Tournament"
    }
    distonnom() {
        console.log(this.name);
    }

    select(solution) {
        return 1
    }
}



/**********************CROISEMENT**********************************/

class CrossoverStrategy {
    constructor(strategy) {
        this.name = "parent"
        this.strategy = null;
    }

    setStrategy(strategy) {
        if (strategy == "onepoint")
            this.strategy = new OnePointCrossoverStrategy()
        else if (strategy == "scrambler")
            this.strategy = new ScramblerCrossoverStrategy()
    }
    distonnom() {
        this.strategy.distonnom()
    }

    crossover(solution) {
        return this.strategy.crossover(solution)
    }
}

class OnePointCrossoverStrategy extends CrossoverStrategy {
    constructor() {
        super()
        this.name = "onepoint"
    }
    distonnom() {
        console.log(this.name);
    }

    crossover(solution) {
        // code
        return 1
    }
}

class MoyennePondereeCrossoverStrategy extends CrossoverStrategy {
    constructor() {
        super()
        this.name = "MoyennePonderee"
    }
    distonnom() {
        console.log(this.name);
    }

    crossover(solution) {
        // code
        return 1
    }
}



/**********************MUTATION**********************************/


class MutationStrategy {
    constructor(strategy) {
        this.name = "parent"
        this.strategy = null;
    }

    setStrategy(strategy) {
        if (strategy == "random")
            this.strategy = new RandomMutationStrategy()
        else if (strategy == "scrambler")
            this.strategy = new ScramblerMutationStrategy()
    }
    distonnom() {
        this.strategy.distonnom()
    }

    mutate() {
        return this.strategy.mutate(solution)
    }
}

class RandomMutationStrategy extends MutationStrategy {
    constructor() {
        super()
        this.name = "random"
    }
    distonnom() {
        console.log(this.name);
    }

    mutate(solution) {
        return 1
    }
}

class ScramblerMutationStrategy extends MutationStrategy {
    constructor() {
        super()
        this.name = "scrambler"
    }
    distonnom() {
        console.log(this.name);
    }

    mutate(solution) {
        return 1
    }
}