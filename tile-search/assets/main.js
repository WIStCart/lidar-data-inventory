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
	// Get metadata
	var name = metadata[layerName].name;
	var year = metadata[layerName].year;

	// Save collapse state
	var active = [];
	$('#sidebar li').each(function() {
		active.push($(this).attr('class'));
	});
	
	// Update sidebar
	$('#sidebar').html(genSidebar(name, year, tileName));

	// Initialize collapsable elements
	var elem = document.querySelector('.collapsible.expandable');
	var instance = M.Collapsible.init(elem, {
		accordion: false
	});

	// Reinstate collapse state
	$.each(active, function(index, value){
		if (value == 'active') {
			instance.open(index);
		}
	});

	// Bring feature to front of layer
	if(typeof layer !== "undefined"){ layer.bringToFront(); }

	// Add or update tile url parameter
	var urlParams = new  URLSearchParams(window.location.search);
	urlParams.set('tile', tileName)
	let urlPath = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + urlParams;
	window.history.pushState({ path: urlPath }, '', urlPath);
}

function genSidebar(name, year, tileName) {
	// Build html string
	var html = '\
		<h5 class="white-text center-align" style="">' + name + ' ' + year + '</h5>\
		<h6 class="white-text center-align" style="margin-bottom: 1em;">Tile ' + tileName + '</h6>\
		<ul class="collapsible expandable z-depth-0">';

	// Added datasets to html string
	for (var i=0; i<metadata[layerName].datasets.length; i++) {
		html += '\
			<li>\
				<div class="collapsible-header blue-grey darken-3 white-text">' + metadata[layerName].datasets[i].name + '<i class="material-icons chevron">chevron_left</i></div>\
				<div class="collapsible-body"><span>'+ genLinks(tileName,metadata[layerName].datasets[i]) + '</span></div>\
			</li>';
	}

	// Add report link to html string
	html += '\
		</ul>\
		<div class="center-align" style="margin-bottom: 1rem;">\
			<a class="waves-effect waves-light btn-large red lighten-2" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdS-g0X5xWf6c4GU-3_lC6UqHeK65M2xq5kTIUgU28Tgd35IA/viewform?usp=pp_url' +
			'&entry.1535627210=' + (name + ' ' + year).replace(/\s+/g, '+') +
			'&entry.234183874=' + window.location.href.replace(/=/g, '%3D') +
			'">Report Error</a>\
		</div>';

	// Insert html string into document
	$("#sidebar").html(html);

	// Bring feature to front of layer
	if(typeof layer !== "undefined"){ layer.bringToFront(); }

	// Add or update tile url parameter
	var urlParams = new  URLSearchParams(window.location.search);
	urlParams.set('tile', tileName)
	let urlPath = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + urlParams;
	window.history.pushState({ path: urlPath }, '', urlPath);

	return html
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

// Add Tile Index Layer
var indexStyle = {
	"fillOpacity": 0,
	"color": "#000",
	"weight": 1,
	"opacity": 1
};
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