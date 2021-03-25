

window.addEventListener("load", () => {


$("#joineventform").submit(function( event ) {    
    event.preventDefault();
    console.log($('input[type="text"]').val())
    window.location.replace("/join_event/"+ $('input[type="text"]').val())
  });

$( "#test" ).click(function() {
    $( "h1" ).css("color", "red" );
    event.preventDefault();    
    ajaxPost();
  });

});

function ajaxPost(){
    	
  // PREPARE FORM DATA
  var formData = {
    event : "6057a483396dbc1eb0f020d6"  
  }
  
  // DO POST
  $.ajax({
  type : "POST",
  contentType : "application/json",
  url : "../api/test",
  data : JSON.stringify(formData),
  dataType : 'json',
  success : function(data) {
    console.log(data);
    scheduleOpt = new ScheduleOptimizer(data);
    scheduleOpt.init()
    },
  error : function(e) {
    alert("Error!")
    console.log("ERROR: ", e);
  }
});  
  

}
