class AlgoGen {
    constructor(nbGene, etendueGene, taillePop, ratioMutation, nbElite,
        selection, crossover, mutation, fitnessFct, fitnessParam, solutionFct) {
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
        this.currentGen = []
        this.solutionGenerator = solutionFct
        this.newGen = []       

    }

    init() {

        this.currentGen = []

        for (let i = 0; i < this.population; i++) {
            var individu = {
                solution: this.solutionGenerator(this.nbGene, this.etendueGene),
                fitness: 0
            }

            individu.fitness = this.fitness(this.fitnessParam, individu.solution)
            this.currentGen.push(individu)
        }
        sortPop(this.currentGen);



    }

    nextGen() {
        
        this.newGen = []
        
        // Elite
        this.chooseFitness()   
	           
        for (let i = this.nbElite; i < this.population; i++) {     
            
            
            //Selection
            var parent1 = this.selection.select(this.currentGen)            
            var parent2 = this.selection.select(this.currentGen)               
            
            //Croisement
            var enfant = this.crossover.crossover(parent1.solution, parent2.solution)
            
            //Mutation
            if (Math.random() < this.ratioMutation) { // 10% de chance
                enfant.solution = this.mutation.mutate(enfant.solution)
            }
            
            //Insertion
            enfant.fitness = this.fitness(this.fitnessParam, enfant.solution)
            this.newGen.push(enfant)
        }
        sortPop(this.newGen);
        this.currentGen = this.newGen
        //console.log(this.currentGen);


    }

    chooseFitness(){        
        for (let i = 0; i < this.nbElite; ++i) {
            this.newGen[i] = this.currentGen[i];
	    }
        
    }

    getCurrentGen(){
        return this.currentGen;
    }
    

}

function sortPop(population) {
    population.sort((a, b) => (a.fitness < b.fitness) ? 1 : -1)
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


    select(population) {
        return this.strategy.select(population)
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

    select(population) {

        var tailleTournoi = 12;
        var parent = -1;
        var meilleurescore = -999;
        for (var i = 0; i < tailleTournoi; i++) {
            var random = Math.floor(population.length * Math.random());
            if (population[random].fitness > meilleurescore) {
                meilleurescore = population[random].fitness;
                parent = population[random];
            }
        }
        return parent;

    }
}



/**********************CROISEMENT**********************************/

class CrossoverStrategy {
    constructor(strategy) {
        this.name = "parent"
        this.strategy = null;
        if (strategy == "onepoint")
            this.strategy = new OnePointCrossoverStrategy()
        else if (strategy == "moyenneponderee")
            this.strategy = new MoyennePondereeCrossoverStrategy()
    }
    distonnom() {
        this.strategy.distonnom()
    }

    crossover(solution1, solution2) {
        return this.strategy.crossover(solution1, solution2)
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

    crossover(solution1, solution2) {
        var enfant = {
            solution: [],
            fitness: 0
        }


        var i = Math.floor(solution1.length * Math.random());
        var j = Math.floor(solution2.length * Math.random());
        var premier = Math.min(i, j);
        var second = Math.max(i, j);

        for (var i = premier; i <= second; i++) {
            enfant.solution[i] = solution1[i];
        }

        var index = 0;
        for (var i = 0; i < solution1.length; i++) {
            if (i >= premier && i <= second) {
                continue;
            }
            
            // ne pas inclure les chiffres déjà existant
            // si solution contient déjà le chiffre : avancer dans l'index
            while (enfant.solution.includes(solution2[index])) {
                 index++;                 
             }
            
      
            enfant.solution[i] = solution2[index];
            index++;

        }

        return enfant;
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

    crossover(solution1, solution2) {
        // code
        return 1
    }
}



/**********************MUTATION**********************************/


class MutationStrategy {
    constructor(strategy) {
        this.name = "parent"
        this.strategy = null;

        if (strategy == "swap")
            this.strategy = new SwapMutationStrategy()
        else if (strategy == "scrambler")
            this.strategy = new ScramblerMutationStrategy()
    }
    distonnom() {
        this.strategy.distonnom()
    }

    mutate(solution) {
        return this.strategy.mutate(solution)
    }
}

class SwapMutationStrategy extends MutationStrategy {
    constructor() {
        super()
        this.name = "swap"
    }
    distonnom() {
        console.log(this.name);
    }

    mutate(solution) {
        var i = Math.floor(solution.length * Math.random());
        var j = Math.floor(solution.length * Math.random());

        var temp = solution[i]
        solution[i] = solution[j]
        solution[j] = temp

        return solution
        
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