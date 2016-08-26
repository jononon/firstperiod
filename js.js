function enterAddress () {
  $('#simpleform').hide();
  $('#complexform').show();
}

function initMap() {
  var originSearchBox = new google.maps.places.SearchBox(document.getElementById('startSearch'));
  var currLoc;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(location) {
      currLoc = {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      };
    },
    function (error) {
      enterAddress();
    });
  } else {
    enterAddress();
  }

  originSearchBox.addListener('places_changed', function() {
    var places = originSearchBox.getPlaces();

    if (places.length == 0)
      return;

    places.forEach(function(place){
      currLoc = place.geometry.location;
    });
    update();
  });

  var directionsService = new google.maps.DirectionsService;

  function update() {
    if(currLoc != undefined) {
      calculateRoute()
    }
  }

  function calculateRoute() {
    directionsService.route({
      origin: currLoc,
      destination: {
        lat: 34.139459,
        lng: -118.413477
      },
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if(status=='OK'){
        var message = "";
        $('#input').hide();
        travelMins = response.routes[0].legs[0].duration.value/60%60;
        var now = new Date();
        now.setHours(8);
        if(now.getDay()==0 || now.getDay()==6) {
          message = "<h1><div class=\"alert alert-info\" role=\"alert\">It's the weekend! There isn't even school today!</div></h1>";
        } else if (now.getHours()>=8) {
          message = "<h1><div class=\"alert alert-danger\" role=\"alert\">School has started</div></h1>";
        } else {
          arrivalTime = now.getMinutes()+(now.getSeconds()/60)+travelMins;
          if (arrivalTime>60) {
            message = "<h1><div class=\"alert alert-danger\" role=\"alert\">You'll be late.</div></h1>"
          } else if (arrivalTime>=55) {
            message = "<h1><div class=\"alert alert-warning\" role=\"alert\">You'll be cutting it close!</div></h1>"
          } else {
            message = "<h1><div class=\"alert alert-success\" role=\"alert\">You'll make school on time.</div></h1>"
          }
        }
        var options = { hour: 'numeric', minute: 'numeric' };
        arrivalMins = parseInt(now.getMinutes()+travelMins%60);
        arrivalHours = now.getHours()+parseInt(arrivalMins/60);
        arrivalMins = arrivalMins%60;
        message += "<p>It's currently "+now.getHours()+":"+now.getMinutes()+" and it will take you <b>"+parseInt(travelMins)+" mins</b> to get to school. That means that you'll arrive at <b>"+arrivalHours+":"+arrivalMins+"</b></p>"
        $('#result').html(message);
      }
    });
  }

  setInterval(function() {
    console.log("Recalculating");
    update();
  },60000);

  $("#refresh").click(function(){
    $("body").addClass("grey");
    setTimeout(function(){
      update();
    },100);
  });

  $("#go").click(function(){
    update();
  });
}
