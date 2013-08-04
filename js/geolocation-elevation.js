var myMap = null;

var pointsArray = ['p1.png', 'p2.png', 'p3.png', 'p4.png', 'p5.png', 'p6.png', 'p7.png', 'p8.png',
		'p9.png', 'p10.png', 'p11.png', 'p12.png', 'p13.png'];

window.onload = function () {
	plotMap();
}

var plotMap = function () {
	var div = document.getElementById('main'),
 	
	mapOptions = {
    	center: new google.maps.LatLng(-30.032391391218515, -51.20845556259155),
      	zoom: 14,
      	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
	myMap = new google.maps.Map(div, mapOptions);

	google.maps.event.addListener(myMap, 'click', function(ev) {
		addPoints(ev.latLng);
	});
}

var addPoints = function (point) {

	var circles = 5,
		markersArray = [],
		circleRadiusIncrement = 0.002,
		currentCircleRadius = 0,
		pointsPerCircle = [5, 5, 5, 5, 5],
		currentAngleIncrement = 0,
		currentAngle = 0,
		initialAngle = 0,
		currentLatitude = 0,
		currentLongitude = 0;
	

	var myLatlng = new google.maps.LatLng(point.jb, point.kb);
	markersArray.push(myLatlng);

	for (var i = 0, len = pointsPerCircle.length; i < len; i++) {
		currentCircleRadius += circleRadiusIncrement;

		initialAngle = 2 * Math.PI/pointsPerCircle[i]*Math.random();
		
		currentAngleIncrement = initialAngle;

		currentAngleIncrement += 2 * Math.PI/pointsPerCircle[i];

		for (var j = 0, len2 = pointsPerCircle[i]; j < len2; j++) {
			currentAngle += currentAngleIncrement;

			currentLatitude = point.jb + (currentCircleRadius) * Math.cos(currentAngle);
			currentLongitude = point.kb + (currentCircleRadius) * Math.sin(currentAngle);

			var myLatlng = new google.maps.LatLng(currentLatitude, currentLongitude);
			markersArray.push(myLatlng)
		}
	}

	getInfo(markersArray);
}

var getInfo = function (points) {
	var locations = '';

	for (var i = 0, len = points.length; i < len; i++) {
		locations += points[i].jb + ',' + points[i].kb;

		if (i !== points.length - 1) {
			locations += '|';
		}
	}

	locations += '&sensor=false';

	var url = 'http://maps.googleapis.com/maps/api/elevation/json?locations=' + locations;
	

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'json',   
		success: function(data){
			plotElevationPoints(data);
		}
	});
}

var plotElevationPoints = function (data) {
	
	var marker = null, 
		step = 5,
		myLatlng = null,
		index = 0;

	for (var i = 0, len = data.results.length; i < len; i++) {


		index = Math.floor(data.results[i].elevation/step);
		
		myLatlng = new google.maps.LatLng(data.results[i].location.lat, data.results[i].location.lng);

		index = index > 12 ? 12 : index;

		marker = new google.maps.Marker({
	    	position: myLatlng,
	    	icon: 'img/' + pointsArray[index]
		});

		marker.setMap(myMap);
	}
}
