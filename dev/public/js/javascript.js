
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
    eventID:eventID
  }

  fetch("../api/test", {
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
       scheduleOpt = new ScheduleOptimizer(data);
       scheduleOpt.init();
       scheduleOpt.start();
       //scheduleOpt.start_sansobserver(); // genMax en param

     })
  }
