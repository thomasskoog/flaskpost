
var currentPositionMarker,
    mapCenter = new google.maps.LatLng(59.446802000, 18.0719442),
    map,
    readRange = 30;

$('#submit').click(function(){
    var mess = $.trim($('#msg').val());
    if(mess){
        navigator.geolocation.getCurrentPosition(function(pos){
            var phpLat = pos.coords.latitude;
            var phpLng = pos.coords.longitude;
            var bottleSendData = {
                lat: phpLat,
                lng: phpLng,
                msg: mess
            };
            $.post($('#form').attr('action'), bottleSendData, function(info){
                $('#result').html(info);
                clearInput();
            });
        });
    }
});

$('#form').submit(function(){
    return false;
});

function clearInput(){
    $('#form :input').each(function(){
       $(this).val('');
    });
}

function initMap(){
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 17,
        center: mapCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var bounds = new google.maps.LatLngBounds();
    $.post('php/bottleAll.php', function(bottleArray) {
        var bottles = JSON.parse(bottleArray);
        var image = {
            url: '../images/message-in-a-bottle-w60.png',
            anchor: new google.maps.Point(0, 94)
        };
        var infoWindow = new google.maps.InfoWindow({maxWidth: 300}), marker, i;
        for (i = 0; i < bottles.length; i++){
            var position = new google.maps.LatLng(parseFloat(bottles[i].lat), parseFloat(bottles[i].lng));
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: image
            });
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(bottles[i].msg);
                    var range = google.maps.geometry.spherical.computeDistanceBetween(marker.position, currentPositionMarker.position);
                    if (range < readRange){
                        infoWindow.open(map, marker);
                    }
                }
            })(marker, i));
            map.fitBounds(bounds);
        }
    });
}

function locError(error){
    alert("The current position could not be found!");
}

function setCurrentPosition(pos){
    var image = {
        url: '../images/pirateship_w75.png',
        anchor: new google.maps.Point(37, 100)
    };
    currentPositionMarker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
        ),
        icon: image,
        title: "Current Position",
        zIndex: 999
    });
    var circle = new google.maps.Circle({
        strokeColor: '#5e98f0',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#5e98f0',
        fillOpacity: 0.20,
        map: map,
        radius: readRange
    });
    circle.bindTo('center', currentPositionMarker, 'position');
    map.panTo(new google.maps.LatLng(
        pos.coords.latitude,
        pos.coords.longitude
    ));
}

function displayAndWatch(position){
    setCurrentPosition(position);
    watchCurrentPosition();
}

function watchCurrentPosition(){
    navigator.geolocation.watchPosition(
        function (position){
            setMarkerPosition(currentPositionMarker, position);
        }
    );
}

function setMarkerPosition(marker, position){
    marker.setPosition(
        new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude)
    );
}

function initLocationProcedure(){
    initMap();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayAndWatch, locError);
    } else {
        alert("Your browser does not support Geolocation.");
    }
}

$(document).ready(function(){
    initLocationProcedure();
});

