var myMap = null;

var pointsArray = ['p1.png', 'p2.png', 'p3.png', 'p4.png', 'p5.png', 'p6.png', 'p7.png', 'p8.png',
		'p9.png', 'p10.png', 'p11.png', 'p12.png', 'p13.png'];

var body;

window.onload = function () {
	body = $('body');
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
		currentLongitude = 0, 
		pointLatLng,
		periphericalPoint;
	
	pointLatLng = new google.maps.LatLng(point.lat(), point.lng());
	markersArray.push(pointLatLng);

	for (var i = 0, len = pointsPerCircle.length; i < len; i++) {
		currentCircleRadius += circleRadiusIncrement;

		initialAngle = 2 * Math.PI/pointsPerCircle[i]*Math.random();
		
		currentAngleIncrement = initialAngle;

		currentAngleIncrement += 2 * Math.PI/pointsPerCircle[i];

		for (var j = 0, len2 = pointsPerCircle[i]; j < len2; j++) {
			currentAngle += currentAngleIncrement;

			currentLatitude = point.lat() + (currentCircleRadius) * Math.cos(currentAngle);
			currentLongitude = point.lng() + (currentCircleRadius) * Math.sin(currentAngle);

			periphericalPoint = new google.maps.LatLng(currentLatitude, currentLongitude);
			markersArray.push(periphericalPoint);
		}
	}

	getInfo(markersArray);
}

var getInfo = function (points) {
	var locations = '',
		pointsUrl

	for (var i = 0, len = points.length; i < len; i++) {
		locations += points[i].lat() + ',' + points[i].lng();

		if (i !== points.length - 1) {
			locations += '|';
		}
	}

	locations += '&sensor=false';

	pointsUrl = 'http://maps.googleapis.com/maps/api/elevation/json?locations=' + locations;
	pointsUrl = encodeURI(pointsUrl);
	pointsUrl = pointsUrl.replace('&', '%26');
	
	getLocationsData(pointsUrl);
}

var getLocationsData = function (locations) {
	var existentScript = $('.data-jsonp'),
		tag;

	if (existentScript.length !== 0) {
		existentScript.remove();
	}

	tag = document.createElement('script');
	body.append(tag);

	tag.onload = function () {
		plotElevationPoints(topographyData);
	}
	tag.className = 'data-jsonp';
	tag.src = 'http://dailydevtips.com/post/092/getPointsData.php?url=' + locations;

}

var plotElevationPoints = function (data) {
	
	var marker = null, 
		step = 5,
		markerLatlng = null,
		index = 0;

	for (var i = 0, len = data.results.length; i < len; i++) {


		index = Math.floor(data.results[i].elevation/step);
		
		markerLatlng = new google.maps.LatLng(data.results[i].location.lat, data.results[i].location.lng);

		index = index > 12 ? 12 : index;

		marker = new google.maps.Marker({
	    	position: markerLatlng,
	    	icon: 'img/' + pointsArray[index]
		});

		marker.setMap(myMap);
	}
}