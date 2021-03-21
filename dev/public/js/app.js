window.addEventListener("load", () => {


$("#joineventform").submit(function( event ) {    
    event.preventDefault();
    console.log($('input[type="text"]').val())
    window.location.replace("/join_event/"+ $('input[type="text"]').val())
  });

});