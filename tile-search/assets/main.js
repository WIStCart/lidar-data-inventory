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
	var tileName = e.sourceTarget.feature.properties.tileName;
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
	html += '<a target="_blank" href="https://forms.gle/LWuR678ijmQEMdbB8">Report Error</a>';

	// Insert html string into document
	$("#sidebar").html(html);

	if(typeof layer !== "undefined"){ layer.bringToFront(); }

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
