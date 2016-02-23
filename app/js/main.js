
var currentPositionMarker,
    mapCenter = new google.maps.LatLng(14.668626, 121.24295),
    map;

$('#submit').click(function(){
    var data = $('#myForm :input').serializeArray();
    console.log(data);
    $.post($('#myForm').attr('action'), data, function(info){
        $('#result').html(info);
        clearInput();
    });/*
    $.ajax({
        url: 'php/msg.php',
        data: {
            'lat': currentPositionMarker.position.coords.latitude,
            'lng': currentPositionMarker.position.coords.longitude
        },
        type: 'POST',
        success: function (result) {
            // If your backend page sends something back
            alert(result);
        }
    });*/
});

$('#myForm').submit(function(){
    return false;
});

function clearInput(){
    $('#myForm :input').each(function(){
       $(this).val('');
    });
}

function initMap(){
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 17,
        center: mapCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}

function locError(error){
    alert("The current position could not be found!");
}

// current user position
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
    var positionTimer = navigator.geolocation.watchPosition(
        function (position){
            setMarkerPosition(
                currentPositionMarker,
                position
            );
        });
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

