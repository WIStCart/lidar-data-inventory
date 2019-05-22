// Highlight and dehighlight logic
function highlight(layer) {
	layer.setStyle({
		weight: 8,
		color: '#15d8db',
		dashArray: '',
		fillOpacity: 0.4
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
		if(selected !== null){ selected.bringToFront(); }
	}
}

function dehighlight(layer) {
	if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
		indexLayer.resetStyle(layer);
	}
}

function select (layer) {
	if (selected !== null) {
		var previous = selected;
	}
	// map.fitBounds(layer.getBounds());
	selected = layer;
	if (previous) {
		dehighlight(previous);
	}
}

var selected = null;

// END highlight and dehighlight logic


function featureClick(e) {
	// Update sidebar

	// Get metadata
	var tileName = e.sourceTarget.feature.properties.tileName
	var deliveryName = metadata[layerName].deliveryName
	var lasURLs = metadata[layerName].lasURLs;
	var demURLs = metadata[layerName].demURLs;
	var dsmURLs = metadata[layerName].dsmURLs;
	var breaklines = metadata[layerName].breaklines;
	var contours = metadata[layerName].contours;
	var delivery = metadata[layerName].deliveryFolder;

	// Build html content string
	var html = 
		// '<h1>' + 
		// 	metadata[e.sourceTarget.feature.properties.sourceName].name +
		// '</h1>' +
		'<h2>' +
			deliveryName +
		'</h2><hr>' +
		'<h3>Tile ' + tileName + '</h3>' +
		'<b>LAS:</b><br><div class="download-links">'+ genLinks(tileName,lasURLs) + '</div>' +
		'<br>' +
		'<b>DEM:</b><div class="download-links">' + genLinks(tileName,demURLs) + '</div>' +
		'<br>' +
		'<b>DSM:</b><div class="download-links">' + genLinks(tileName,dsmURLs) + '</div>' +
		'<br>' +
		'<b>Breaklines:</b> ' + genLinks(tileName,breaklines) +
		'<br><br>' +
		'<b>Contours:</b><div class="download-links"> ' + genLinks(tileName,contours) + '</div>' +
		'<br>' +
		'<b>Delivery Folder:</b> ' + genLinks(tileName,delivery) + '<br><br>';			;

	// Insert html string into document
	$("#sidebar").html(html);

	if(typeof layer !== "undefined"){ layer.bringToFront(); }

}

function genLinks(tileName,urls) {
	// If string not object
	if (typeof urls === 'string') {
		var url = urls;
		if (urls == "N/A") { return url }
		else { return '<a target="_blank" href="' + url + '">directory</a>' }
	}

	// Prepare html blob
	var htmlContent = "";
	
	for (const source in urls) {

		var url = urls[source];

		// If multiple sources add source name
		if (source != "null") { 
			if (htmlContent != "") { htmlContent = htmlContent + '<br>'}  // Add break to separate multiple sources
			htmlContent = htmlContent + '<br><b>' + source + '</b><br>'
		}

		// Add all urls
		for (var i = 1; i < url.length; i++) {
			htmlContent = htmlContent + '<a target="_blank" href="' + url[0] + tileName + url[i] + '">' + tileName + url[i] + '</a><br>'
		}
		// Add directory link
		htmlContent = htmlContent +  '<a target="_blank" href="' +  url[0].substring(0, url[0].lastIndexOf("/") + 1) + '">directory</a>'

	}
	return htmlContent
}

function onEachFeature(feature, layer) {

	layer.on({
		'mouseover': function (e) {
			highlight(e.target);
		},
		'mouseout': function (e) {
			dehighlight(e.target);
		},
		'click': function (e) {
			select(e.target);
			featureClick(e);
		}
	});

}



// Set initial view
var map = L.map('map');

// Get acquisition 
var urlParams = new  URLSearchParams(window.location.search);
var layerName = urlParams.get('layer');

// Add Base Layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiZWx6YSIsImEiOiJjanVlNWZ5N2cwb2pyNDR0YzV2YmtteTB4In0.6BAcP2DqZG34BAyy7ug75Q'
}).addTo(map);

// Add WI Counties Layer
var countyStyle = {
	"fillOpacity": 0,
	"color": "#000",
	"weight": 3,
	"opacity": 0.2
};
var countiesLayer = L.geoJSON(wiCounties, {style: countyStyle});
countiesLayer.addTo(map);
map.fitBounds(countiesLayer.getBounds());

// Tile Index
var indexStyle = {
	"fillOpacity": 0,
	"color": "#000",
	"weight": 1,
	"opacity": 1
};

// Add tile index
var indexLayer = L.geoJson.ajax("layers/" + layerName + ".geojson", {
	style: indexStyle,
	onEachFeature: onEachFeature
})
indexLayer.addTo(map);

// Zoom to 
indexLayer.addTo(this.map);
indexLayer.on('data:loaded', function() {
	this.map.fitBounds(indexLayer.getBounds());
}.bind(this));