
var currentPositionMarker,
    mapCenter = new google.maps.LatLng(59.446802000, 18.0719442),
    map,
    readRange = 30,
    infoWindow = new google.maps.InfoWindow({maxWidth: 300}), marker, i;
/*
// Hiding shadow and white background div:s (for styling infowindows in SCSS instead)
google.maps.event.addListener(infoWindow, 'domready', function(){
    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    iwOuter.parent().parent().css({left: '115px'});
    iwBackground.children(':nth-child(1)').attr('style',function(i,s){return s + 'left: 76px !important;'});
    iwBackground.children(':nth-child(3)').attr('style',function(i,s){return s + 'left: 76px !important;'});
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow' : 'rgba(72,181,233,0.6) 0px 1px 6px'});
});*/

// When submitting message: post user input value + lat/lng to database, show result, clear input
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

// Do not send form the ordinary way, stop process
$('#form').submit(function(){
    return false;
});

// Clear form when submitted
function clearInput(){
    $('#form :input').each(function(){
       $(this).val('');
    });
}

// Set bottle markers on map by looping through all messages in database table
function setBottles(){
    var bounds = new google.maps.LatLngBounds();
    $.post('php/bottleAll.php', function(bottleArray){
        var bottles = JSON.parse(bottleArray);
        var image = {
            url: 'images/message-in-a-bottle-w60.png',
            anchor: new google.maps.Point(0, 94)
        };
        for (i = 0; i < bottles.length; i++){
            var position = new google.maps.LatLng(parseFloat(bottles[i].lat), parseFloat(bottles[i].lng));
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: image
            });
            google.maps.event.addListener(marker, 'click', (function(marker, i){
                return function(){
                    infoWindow.close();
                    infoWindow.setContent(
                        '<div id="iw-container">' +
                       '<pre>' + bottles[i].msg + '</pre>'
                        + '</div>'
                    );
                    // Make sure only to display message when within user range
                    var range = google.maps.geometry.spherical.computeDistanceBetween(marker.position, currentPositionMarker.position);
                    if (range <= readRange){
                        infoWindow.open(map, marker);
                    }
                }
            })(marker, i));
            map.fitBounds(bounds);
        }
    });
}

// Pretty self-explanatory stuff down below
function initMap(){
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 17,
        center: mapCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var styles =
    [
        {
            "featureType":"landscape",
            "elementType":"all",
            "stylers": [
                {"hue":"#FFAD00"},
                {"saturation":50.2},
                {"lightness":-34.8},
                {"gamma":1}
            ]
        },
        {
            "featureType":"landscape.natural.landcover",
            "elementType":"geometry.fill",
            "stylers": [
                {"color":"#cbb42e"},
                {"visibility":"on"}
            ]
        },
        {
            "featureType":"poi",
            "elementType":"all",
            "stylers":[
                {"hue":"#FFC300"},
                {"saturation":54.2},
                {"lightness":-14.4},
                {"gamma":1}
            ]
        },
        {
            "featureType":"road.highway",
            "elementType":"all",
            "stylers":[
                {"hue":"#FFAD00"},
                {"saturation":-19.8},
                {"lightness":-1.8},
                {"gamma":1}
            ]
        },
        {
            "featureType":"road.arterial",
            "elementType":"all",
            "stylers":[
                {"hue":"#FFAD00"},
                {"saturation":72.4},
                {"lightness":-32.6},
                {"gamma":1}
            ]
        },
        {
            "featureType":"road.local",
            "elementType":"all",
            "stylers":[
                {"hue":"#FFAD00"},
                {"saturation":74.4},
                {"lightness":-18},
                {"gamma":1}
            ]
        },
        {
            "featureType":"water",
            "elementType":"all",
            "stylers":[
                {"hue":"#00FFA6"},
                {"saturation":-63.2},
                {"lightness":38},
                {"gamma":1}
            ]
        },
        {
            "featureType":"water",
            "elementType":"geometry.fill",
            "stylers":[
                {"visibility":"on"},
                {"color":"#ffe59c"}
            ]
        }
    ];
    map.setOptions({styles: styles});
}

function locError(error){
    alert("The current position could not be found!");
}

function setCurrentPosition(pos){
    var image = {
        url: 'images/pirateship_w75.png',
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
        zIndex: 9999
    });
    // Set visible user range as well
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
    setBottles();
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

// Don't run anything until document is ready
$(document).ready(function(){
    initLocationProcedure();
});

