
var currentPositionMarker,
    mapCenter = new google.maps.LatLng(59.446802000, 18.0719442),
    map;

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
            }
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

$('#read').click(function(){
    /* if('userpos == dbPosMarker'){ */
     /* navigator.geolocation.getCurrentPosition(function(pos){
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            var bottleReadData = {
                lat: lat,
                lng: lng
            }
            $.post('php/bottleRead.php', bottleReadData, function(info) {
                $('#result').html(info);
            });
        }); */
    /* } */
});

function initMap(){
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 17,
        center: mapCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    /* Skapa flaskpost-markörer från databasen här? */
    /* foreach id in messages skapa markör enligt nedanstående mönster + ge unikt id? */

    $.post('php/bottleAll.php', function(bottleArray) {
        /*$('#result').html(info);*/

        /* loopa igenom assoc-arrayen! */
        $('#result').html(bottleArray);


    });

    /*
    var marker01 = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: {lat: 59.327, lng: 18.067}
    });
    marker01.addListener('click', toggleBounce);

    function toggleBounce() {
        if (marker01.getAnimation() !== null) {
            marker01.setAnimation(null);
        } else {
            marker01.setAnimation(google.maps.Animation.BOUNCE);
        }
    }*/
}

function locError(error){
    alert("The current position could not be found!");
}

function setCurrentPosition(pos){
    currentPositionMarker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
        ),
        title: "Current Position"
    });
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
            setMarkerPosition(
                currentPositionMarker,
                position
            );
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

