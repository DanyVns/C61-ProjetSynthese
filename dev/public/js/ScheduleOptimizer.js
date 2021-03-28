


class ScheduleOptimizer {
    constructor(data) {
        this.dispo = data.dispo;
        this.event = data.event;
        this.users = [];
        this.userDict = [];
        this.timeslots = [];
        this.AlgoGen = null;
    }

    init() {
        const journee = 24 * 60 * 60 * 1000; 
        var dateCourante= new Date(this.event.start_date)        
        var datefin= new Date(this.event.end_date)
        var nombreJours=Math.round(Math.abs((datefin - dateCourante) / journee));  
        
        console.log(nombreJours);

        // générer les Cases horaires
        for (let jour=0; jour <=2; jour++){
            for (let index=this.event.start_time; index <=this.event.end_time; index++) {
                var heureFormat = index < 10 ? "0" + index : index 
                var mois = dateCourante.getMonth()+1
                var moisFormat = mois < 10 ? "0" + mois : mois; 
                var date = dateCourante.getDate()+1
                var timeslot = dateCourante.getFullYear() + moisFormat + date  + heureFormat + "00"
                this.timeslots.push(timeslot)
            }
            dateCourante.setDate(dateCourante.getDate()+1)
        }

        console.log(this.timeslots);


        // Donner un nombre pour chaque utilisateur
        this.dispo.forEach(element => {
            this.users[Object.keys(this.users).length] = element._id
        });
        var userNb = Object.keys(this.users).length 


        this.dispo.forEach(element => {
            if(element.user._id == "604b7273987f7c840c1da410")
                var rienfaire = "rienfaire"
        })

        var fitnessParam = [this.dispo, this.users, this.timeslots]
        console.log(this.timeslots.length + "nombre de slots");
        var nbGene = this.timeslots.length
        var etendueGene = [0, userNb]
        var nbElite = 10
        var ratioMutation = 10
        var taillePop = 100
        var selection = "tournament"
        var crossover = "onepoint"
        var mutation = "scrambler"

        this.AlgoGen = new AlgoGen(nbGene, etendueGene, taillePop,
                                   ratioMutation, nbElite, selection, crossover, mutation,
                                    this.fitness, fitnessParam)

        
    }

    fitness(fitnessParam, solution) {
        var dispo = fitnessParam[0]
        var users = fitnessParam[1]
        var timeslots = fitnessParam[2]

        console.log(dispo[solution[0]].dispos.indexOf(timeslots[0]));
        console.log("début for loop");
        for (let index = 0; index < solution.length; index++) {
            console.log(solution[index]);
            if (solution[index] != -1 && dispo[solution[index]].dispos.indexOf(timeslots[index]) > -1) {

                console.log("solution bonne!");
                console.log(dispo[solution[index]].dispos);
                console.log("conteint : ");
                console.log(timeslots[index]);
            }
            
        }
        
        console.log();
        
    }
}