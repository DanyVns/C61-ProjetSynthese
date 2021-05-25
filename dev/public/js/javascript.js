var afficherLibre = false;
window.addEventListener("load", () => {


  $("#joineventform").submit(function (event) {
    event.preventDefault();

    window.location.replace("/join_event/" + $('input[type="text"]').val())
  });

  $("#btn-generate").click(function () {
    $(".progress").removeClass("d-none")
    $("#solutioncontainer").addClass("d-none")
    $(".progress-bar").addClass("notransition");
    $('.progress-bar').attr('style', "width: 0%");
    if ($('#showEmpty').is(":checked"))
      {
        afficherLibre = true
      }
    else
      afficherLibre = false
   
    event.preventDefault();
    $
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
      startAlgo(data)


    })
}


function copyToClipboard(text) {
  const elem = document.createElement('textarea');
  elem.value = text;
  document.body.appendChild(elem);
  elem.select();
  document.execCommand('copy');
  document.body.removeChild(elem);
  alert("L'ID est copié dans votre presse-papiers")
}

function startAlgo(data) {
  scheduleOpt = new ScheduleOptimizer(data, showSolution);
  scheduleOpt.init();
  scheduleOpt.start();
};

function showSolution(solution, timeslots, users, errors) {
  $("#solutioncontainer").removeClass("d-none")
  $(".progress").addClass("d-none")
  $("#solutionErrorTitle").html("")
  var listeError = $("#solutionErrorListe")
  let caseHoraire = ""
  let timeslotFormatee = [];
  listeError.html("")
  var table = $('#solutionBody')
  table.empty();
  if (errors) {    

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
    // afficher seulement les usagers non inclus dans les erreurs  
    $.each(timeslots, function (i) {      
      timeslotFormatee = solutionFormat(timeslots[i])    
      if(typeof users[solution.solution[i]] == "undefined" || errors.includes(users[solution.solution[i]]))
      caseHoraire = "**LIBRE**"
      else 
      caseHoraire = users[solution.solution[i]]
      if(!(caseHoraire == "**LIBRE**" && !afficherLibre) ){
        appendToTable(table, timeslotFormatee, caseHoraire)
      }
    });
  }
  else { // afficher tous les usagers - sans erreur
    $.each(timeslots, function (i) {
      timeslotFormatee = solutionFormat(timeslots[i])           

      if(typeof users[solution.solution[i]] == "undefined")
        caseHoraire = "**LIBRE**"
      else 
        caseHoraire = users[solution.solution[i]]
        if(!(caseHoraire == "**LIBRE**" && !afficherLibre) ){
          appendToTable(table, timeslotFormatee, caseHoraire)
      }

    });
  }
}

function appendToTable(table, timeslot, nom){
       var tr = $('<tr/>')
          .appendTo(table);          
          var th = $('<th/>')         
          .text(timeslot[0])
          .appendTo(tr);
          var th2 = $('<th/>')         
          .text(timeslot[1])
          .appendTo(tr);
          var td = $('<td/>')         
          .text(nom)
          .appendTo(tr);
}

function solutionFormat(solution) {
  let insert = "-"
  let positions = [6, 4]
  let solutionFormat = solution
  positions.forEach(position => {
    solutionFormat = [solutionFormat.slice(0, position), insert, solutionFormat.slice(position)].join('');
  });

  solutionFormat = [solutionFormat.slice(0, -2), "h", solutionFormat.slice(-2)].join('');

  solutionFormatee = [];
  solutionFormatee[0] = solutionFormat.slice(0,10)  
  solutionFormatee[1] = solutionFormat.slice(10,15)
  
  return solutionFormatee
}

// https://www.codexworld.com/export-html-table-data-to-excel-using-javascript/
function exportTableToExcel(tableID, filename = ''){
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
  // Specify file name
  filename = filename?filename+'.xls':'excel_data.xls';
  
  // Create download link element
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob){
      var blob = new Blob(['\ufeff', tableHTML], {
          type: dataType
      });
      navigator.msSaveOrOpenBlob( blob, filename);
  }else{
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click();
  }
}
