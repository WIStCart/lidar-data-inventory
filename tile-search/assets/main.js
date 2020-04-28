// Highlight and dehighlight logic
function highlight(layer) {
	layer.setStyle({
		weight: 8,
		color: '#15d8db',
		dashArray: '',
		fillOpacity: 0.4
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
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


function featureClick(tileName) {
	// Update sidebar

	// Get metadata
	var name = metadata[layerName].name;
	var year = metadata[layerName].year;

	// Build html string
	var html =
		'<h2>' +
			name + " " + year +
		'</h2><hr>' +
		'<h3>Tile ' + tileName + '</h3>';

	// Added datasets to html string
	for (var i=0; i<metadata[layerName].datasets.length; i++) {
		html += '<b>' + metadata[layerName].datasets[i].name + ':</b><br><div class="download-links">'+ genLinks(tileName,metadata[layerName].datasets[i]) + '</div><br>'
	}

	// Add report link to html string
	html += '<a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdS-g0X5xWf6c4GU-3_lC6UqHeK65M2xq5kTIUgU28Tgd35IA/viewform?usp=pp_url' +
		'&entry.1535627210=' + (name + ' ' + year).replace(/\s+/g, '+') +
		'&entry.234183874=' + window.location.href.replace(/=/g, '%3D') +
		'">Report Error</a>';

	// Insert html string into document
	$("#sidebar").html(html);

	// Bring feature to front of layer
	if(typeof layer !== "undefined"){ layer.bringToFront(); }

	// Add or update tile url parameter
	var urlParams = new  URLSearchParams(window.location.search);
	urlParams.set('tile', tileName)
	let urlPath = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + urlParams;
	window.history.pushState({ path: urlPath }, '', urlPath);
}

function genLinks(tileName,dataset) {
	// If string not object
	if (dataset.tiled === false) {
		return '<a target="_blank" href="' + dataset.baseURL + '">directory</a>'
	}

	// Prepare html blob
	var htmlContent = "";

	for (var i = 0; i < dataset.URLexts.length; i++) {
		var ext = dataset.URLexts[i];
		htmlContent += '<a target="_blank" href="' + dataset.baseURL + tileName + ext + '">' + tileName + ext + '</a><br>';
	}

	// Add directory link
	htmlContent +=  '<a target="_blank" href="' +  dataset.baseURL.substring(0, dataset.baseURL.lastIndexOf("/") + 1) + '">directory</a>';
	
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
			featureClick(e.sourceTarget.feature.properties.tileName);
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
	accessToken: 'pk.eyJ1Ijoid2lzdGNhcnQiLCJhIjoiY2szNTFmcTAzMDMxdjNocjE4eGR2YXhkeCJ9.Q9t62J7gPOHbLc1TL7X-ew'
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

// Select initial tile from url parameter if present
if (urlParams.get('tile') != null) {
	featureClick(urlParams.get('tile'))
}