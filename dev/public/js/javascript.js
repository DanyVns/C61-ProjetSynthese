
window.addEventListener("load", () => {


  $("#joineventform").submit(function (event) {
    event.preventDefault();
    console.log($('input[type="text"]').val())
    window.location.replace("/join_event/" + $('input[type="text"]').val())
  });

  $("#test").click(function () {
    $("h1").css("color", "red");
    event.preventDefault();
    ajaxPost(this.getAttribute("eventid"));
  });

});

async function ajaxPost(eventID) {

  // PREPARE FORM DATA
  // let formData = new FormData();
  // formData.append("eventID", eventID)
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

       // TODO - design patern observer
     })
  }
