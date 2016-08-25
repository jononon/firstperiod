$("#go").click(function(){

}

function enterAddress () {

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
      originMarker.setPosition(place.geometry.location);
    });
    updateBounds();
    update();
  });

  var directionsService = new google.maps.DirectionsService;

  function update() {
    if(currLoc != undefined) {
      calculateRoute(originMarker.position, destMarker.position);
    }
  }

  function calculateAndDisplayRoute(start, end) {
    directionsService.route({
      origin: start,
      destination: {
        lat: 34.139459,
        lng: -118.413477
      },
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if(status=='OK'){
        var message;
        travelMins = response.routes[0].legs[0].duration.value/60%60;
        var now = new Date();
        if(now.getDay()==0 || now.getDay()==6) {
          message = "It's the weekend! There isn't even school today!";
        } else if (now.getHours()>=8) {
          message = "School has started";
        } else {
          arrivalTime = now.getMinutes()+(now.getSeconds()/60)+travelMins;
          if (arrivalTime>60) {
            message = "you'll miss it"
          } else if (arrivalTime>=55) {
            message = "You're cutting it close"
          } else {
            message = "you're good"
          }
        }
        console.log(message);
      }
    });
  }

  function updateBounds () {
    var bounds = new google.maps.LatLngBounds();
    if(originMarker.position != undefined)
      bounds.extend(originMarker.position);
    if(destMarker.position != undefined)
      bounds.extend(destMarker.position);
    map.fitBounds(bounds);
    if(map.getZoom()>15)
      map.setZoom(15);
  }

  setInterval(function() {
    if(originMarker.position != undefined && destMarker.position != undefined) {
      console.log("Recalculating");
      calculateRides(originMarker.position.lat(), originMarker.position.lng(), destMarker.position.lat(), destMarker.position.lng());
    }
  },60000);

  $("#refresh").click(function(){
    $("body").addClass("grey");
    setTimeout(function(){
      if(originMarker.position != undefined && destMarker.position != undefined) {
        calculateRides(originMarker.position.lat(), originMarker.position.lng(), destMarker.position.lat(), destMarker.position.lng());
      }
    },100);
  });
}
