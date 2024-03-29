var t2, t1;


class ScheduleOptimizer {
    constructor(data, showSolution) {
        this.dispo = data.dispo;
        this.event = data.event;
        this.users = [];
        this.userDict = {};
        this.timeslots = [];
        this.AlgoGen = null;
        this.showSolution = showSolution
        this.progressobserver = new Observer()
    }



    init() {

        const journee = 24 * 60 * 60 * 1000;
        var dateCourante = new Date(this.event.start_date)
        var datefin = new Date(this.event.end_date)
        var nombreJours = Math.round(Math.abs((datefin - dateCourante) / journee));



        // générer les Cases horaires
        for (let jour = 0; jour <= nombreJours; jour++) {
            for (let index = this.event.start_time; index <= this.event.end_time; index++) {
                var heureFormat = index < 10 ? "0" + index : index
                var mois = dateCourante.getMonth() + 1
                var moisFormat = mois < 10 ? "0" + mois : mois;
                var date = dateCourante.getDate() + 1
                var timeslot = dateCourante.getFullYear() + moisFormat + date + heureFormat + "00"
                this.timeslots.push(timeslot)
            }
            dateCourante.setDate(dateCourante.getDate() + 1)
        }

 


        // Donner un nombre pour chaque utilisateur
        this.dispo.forEach(element => {
            this.userDict[Object.keys(this.userDict).length] = element.user.firstname + " " + element.user.lastname ;
            this.users[Object.keys(this.users).length] = element._id
        });
        var userNb = Object.keys(this.users).length



        var fitnessParam = [this.dispo, this.users, this.timeslots];
    
        var nbGene = this.timeslots.length;
        var etendueGene = [0, userNb];
        var nbElite = 10;
        var ratioMutation = 0.10;
        var taillePop = 1000;
        var selection = "tournament";
        var crossover = "onepoint";
        var mutation = "swap";

        this.AlgoGen = new AlgoGen(nbGene, etendueGene, taillePop,
            ratioMutation, nbElite, selection, crossover, mutation,
            this.fitness, fitnessParam, this.solutionGenerator)

        this.AlgoGen.init();

    }



    start() {


        t1 = new Date()
        var i = 0

        const progress_bar = $("#progress-bar-solution");
        const update_progress = (taille) => progress_bar.width(taille)
        update_progress(0)

        this.progressobserver.subscribe(update_progress)

        this.AlgoGen.nextGen();

        const genMax = 1000;        

        


        const solve = (genCurrent = 0, iteration = 0) => {
            while(genCurrent < Math.floor(genMax/33 * iteration)){
                this.AlgoGen.nextGen()
                genCurrent++;
                
            }
            iteration++
            this.progressobserver.notify(Math.floor(genCurrent / genMax * 100) + "%")
            if (genCurrent < genMax) window.setTimeout(function () { solve(genCurrent, iteration); }, 0);
            else {
                t2 = new Date()
                var dif = (t2 - t1) / 1000
                console.log("Temps en secondes : " + dif);
                console.log("La solution obtenue est : ");
                let solution = this.AlgoGen.getCurrentGen()[0]
                console.log(solution);
                let errors = null
                if (solution.fitness < 0 )
                    errors = this.checkErrors(solution.solution)                   
                       
                
                showSolution(solution, this.timeslots,this.userDict, errors)

            }
        }
        solve();



    }   

    checkErrors(solution) {
        let dispoUsers = this.dispo
        let users = this.users
        let timeslots = this.timeslots

        let errors = []
        

        for (let index = 0; index < solution.length; index++) {
            if (solution[index] <= -1) {                
                continue
            }
            else if (dispoUsers[solution[index]].dispos.indexOf(timeslots[index]) == -1) {                
                errors.push(this.userDict[solution[index]]) // nom de l'usager éronné
            }
            
        }

        
        
        return errors
    };



    fitness(fitnessParam, solution) {
        var dispo = fitnessParam[0]
        var users = fitnessParam[1]
        var timeslots = fitnessParam[2]
     
        var score = 0

        let lastuser = false
        var currentday, lastday;

        var nbUsager = 0

        for (let index = 0; index < solution.length; index++) {
            if (solution[index] <= -1) {
                lastuser = false
                continue
            }
            else if (dispo[solution[index]].dispos.indexOf(timeslots[index]) > -1) {
                score += Math.floor(timeslots.length / users.length)
                nbUsager++
            }
            else {
                score -= timeslots.length * 2
            }



            lastuser = true
            lastday = currentday
            currentday = timeslots[0].slice(6, 8)

            if (lastuser && lastday == currentday) {
                // donnne un meilleur score si les usagers sont collées
                score += 1
                lastuser = false
            }

        }

        return score
    }

    solutionGenerator(nbGene, etendueGene) {

        var solution = remplirTableau(-1, nbGene)

        for (let j = etendueGene[0]; j < etendueGene[1]; j++) {
            solution[j] = j
        }
        melangerTableau(solution)

        return solution
    }
}

function remplirTableau(valeur, longueur) {
    var tableau = [];
    for (var i = 0; i < longueur; i++) {
        tableau.push(valeur);
        valeur -= 1
    }
    return tableau;
}



function melangerTableau(tableau) {
    for (var i = tableau.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = tableau[i];
        tableau[i] = tableau[j];
        tableau[j] = temp;
    }
}

/** Observer pattern */


class Observer {

    constructor() {
        this.observers = [];
    }

    subscribe(subject) {
        this.observers.push(subject);
    }

    unsubscribe(subject) {
        this.observers = this.observers.filter(subscriber => subscriber !== subject);
    }

    notify(data) {
        this.observers.forEach(observer => observer(data));
    }

}