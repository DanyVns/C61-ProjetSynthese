
window.addEventListener("load", () => {


  $("#joineventform").submit(function (event) {
    event.preventDefault();
    console.log($('input[type="text"]').val())
    window.location.replace("/join_event/" + $('input[type="text"]').val())
  });

  $("#btn-generate").click(function () {

    $(".progress-bar").addClass("notransition");
    $('.progress-bar').attr('style', "width: 0%");
    event.preventDefault();
    ajaxPost(this.getAttribute("eventid"));
  });

});

async function ajaxPost(eventID) {

  formData = {
    eventID: eventID
  }

  fetch("../api/schedule", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      startAlgo(data)


    })
}

function startAlgo(data) {
  scheduleOpt = new ScheduleOptimizer(data, showSolution);
  scheduleOpt.init();
  scheduleOpt.start();
};

function showSolution(solution, timeslots, users, errors) {
  $("#solutionErrorTitle").html("")
  var listeError = $("#solutionErrorListe")
  listeError.html("")
  var liste = $('#listesolution')
  liste.empty();
  if (errors) {    
    console.log(errors);
    $("#solutionErrorTitle").html("Attention! L'horaire généré n'a pas fournir une case horaire pour le ou les utilisateur(s) suivants : ")
    $("#solutionErrorTitle").css("color", "red")
    
    $.each(errors, function (i) {
      var li = $('<li/>')
        .addClass('list-group-item ')
        .appendTo(listeError);
      var aaa = $('<span/>')
        .addClass('ui-all')        
        .text(errors[i])
        .appendTo(li);
    });    
  }
  $.each(timeslots, function (i) {
    var li = $('<li/>')
      .addClass('list-group-item ')
      .appendTo(liste);
    let caseHoraire = ""
    if(typeof users[solution.solution[i]] == "undefined" || errors.includes(users[solution.solution[i]]))
      caseHoraire = "**LIBRE**"
    else 
      caseHoraire = users[solution.solution[i]]
    
    var aaa = $('<span/>')
      .addClass('ui-all')      
      .text(solutionFormat(timeslots[i]) + " -- " + caseHoraire)
      .appendTo(li);
  });



}

function solutionFormat(solution) {
  let insert = "-"
  let positions = [8, 6, 4]
  let solutionFormat = solution
  positions.forEach(position => {
    solutionFormat = [solutionFormat.slice(0, position), insert, solutionFormat.slice(position)].join('');
  });

  solutionFormat = [solutionFormat.slice(0, -2), "h", solutionFormat.slice(-2)].join('');


  return solutionFormat
}