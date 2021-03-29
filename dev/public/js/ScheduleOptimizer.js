


class ScheduleOptimizer {
    constructor(data) {
        this.dispo = data.dispo;
        this.event = data.event;
        this.users = [];
        this.userDict = {};
        this.timeslots = [];
        this.AlgoGen = null;
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

        console.log(this.timeslots);


        // Donner un nombre pour chaque utilisateur
        this.dispo.forEach(element => {
            this.userDict[Object.keys(this.userDict).length] = element.user.firstname;
            this.users[Object.keys(this.users).length] = element._id
        });
        var userNb = Object.keys(this.users).length


        this.dispo.forEach(element => {
            if (element.user._id == "604b7273987f7c840c1da410")
                var rienfaire = "rienfaire"
        })

        var fitnessParam = [this.dispo, this.users, this.timeslots];
        console.log(this.timeslots.length + "nombre de slots");
        var nbGene = this.timeslots.length;
        var etendueGene = [0, userNb];
        var nbElite = 10;
        var ratioMutation = 0.10;
        var taillePop = 500;
        var selection = "tournament";
        var crossover = "onepoint";
        var mutation = "swap";

        this.AlgoGen = new AlgoGen(nbGene, etendueGene, taillePop,
            ratioMutation, nbElite, selection, crossover, mutation,
            this.fitness, fitnessParam, this.solutionGenerator)

        this.AlgoGen.init();

    }

    start() {


        var t1 = new Date()
        var i = 0
        while (i < 400) {
            this.AlgoGen.nextGen();
            i++;
        }
        //console.log("gen" + i);
        var t2 = new Date()
        var dif = (t2 - t1) / 1000

        var solution = this.AlgoGen.getCurrentGen()[0]

        //console.log(this.AlgoGen.getCurrentGen());

        console.log("Temps en secondes : " + dif);


        var timeslots = this.timeslots
        var liste = $('#listesolution')
        liste.empty();

        console.log(timeslots[0].slice(6, 8));

        var users = this.userDict
        $.each(timeslots, function (i) {
            var li = $('<li/>')
                .addClass('list-group-item ')
                .appendTo(liste);
            var aaa = $('<span/>')
                .addClass('ui-all')
                .text(timeslots[i] + " -- " + (typeof users[solution.solution[i]] !== "undefined" ? users[solution.solution[i]] : '**LIBRE**'))
                .appendTo(li);
        });
    }

    fitness(fitnessParam, solution) {
        var dispo = fitnessParam[0]
        var users = fitnessParam[1]
        var timeslots = fitnessParam[2]


        //console.log(dispo[solution[0]].dispos.indexOf(timeslots[0]));
        var score = 0


        let lastuser = false
        var currentday, lastday;

        for (let index = 0; index < solution.length; index++) {
            if (solution[index] == -1) {
                lastuser = false
                continue
            }
            else if (dispo[solution[index]].dispos.indexOf(timeslots[index]) > -1) {
                score += 15
            }
            else {
                score -= timeslots.length * 2
            }

            lastuser = true
            lastday = currentday
            currentday = timeslots[0].slice(6, 8)

            if (lastuser && lastday == currentday) {
                // donnne un meilleur score si les usagers sont collées
                score += 5
                lastuser = false
            }
        



        }

        if (score > 0) {
            //console.log("Solution parfaite!");
            //console.log(solution);
            //console.log(fitnessParam);
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