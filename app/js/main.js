/**
 * Created by Thomas on 11/02/2016.
 */
window.onload = function(){

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            /*console.log(position);*/
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            showMap(lat,lon);
            /*document.write('latitude: ' + lat + '<br>' + 'longitude: ' + lon);*/

        });
    } else {
        document.write('Your browser does not support GeoLocation');
    }

    function showMap(lat, lon){
        var myLatLng = new google.maps.LatLng(lat, lon);
        console.log(myLatLng);
        var mapOptions = {
            zoom: 14,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Here you are! (ish)'
        });
    }

}