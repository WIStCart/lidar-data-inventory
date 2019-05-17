// Instantiate some variables to be used later
var geojson;
var updateLast = "08/17/18"
var cartoCountyLayer;

var cartoCSSCounty = "#layer { " +
	"line-opacity: 0.95;" +
	"line-comp-op: soft-light;" +
	"polygon-opacity: 0;" +
	"::caseBottom {" +
		"[zoom < 12]{line-width: 10;}" +
		"[zoom >= 12]{line-width: 20;}" +
		"[zoom >= 14]{line-width: 30;}" +
		"[zoom >= 16]{line-width: 40;}" +
		"line-color:#333333;" +   // it was 333333  396591 blue
		"line-opacity: 0.01;" +  //0.01
	"}" +
	"::case {" +
		"[zoom < 12]{line-width: 2;}" +
		"[zoom >= 12]{line-width: 5;}" +
		"[zoom >= 14]{line-width: 7;}" +
		"[zoom >= 16]{line-width: 9;}" +
    //"line-opacity: 0.01;"+       //
		"line-color:#686868;" +//" 444444;" +    // it was 7e7e7e gray
	"}" +
	"::fill {" +
		"[zoom < 12]{line-width: 1;}" +
		"[zoom >= 12]{line-width: 2;}" +
		"[zoom >= 14]{line-width: 3;}" +
		"[zoom >= 16]{line-width: 4;}" +  //4
		"line-color:#686868;" +   //fff white  bwn counties
	"}" +
"}"+
"#layerLine {" +
	"text-name: [county_nam];" +
	"[[county_nam] = 'Green Lake'] {text-name: \"[county_nam].replace(' ','\\n')\";}" +
	"[[county_nam] = 'Washington'] {text-name: \"[county_nam].replace('ing','-\\ning')\";}" +
	"text-face-name: 'Open Sans Regular';" +
	"text-fill: #151515;" +
	"text-halo-fill: #fff;" +  // was fff
	"text-halo-radius: 0;" +  // no halo
	"text-fill: #fff;"+    // was fff white
	"text-halo-fill: #000000;"+  //was #000000
	/*"text-size: 10;" +
	"text-wrap-width: 1;" +
	"text-wrap-character:'_';" +
	"text-wrap-before: true;" +*/
	"[zoom < 6]{text-name: '';}" +
	"[zoom = 6]{text-size: 7;}" +
	"[zoom = 7]{text-size: 9;}" +
	"[zoom = 8]{text-size: 12;}" +
	"[zoom = 9]{text-size: 16;}" +
	"[zoom = 10]{text-size: 19;}" +
	"[zoom = 11]{text-size: 23;}" +
	"[zoom = 12]{text-size: 26;}" +
	"[zoom = 13]{text-size: 31;}" +
	"[zoom = 14]{text-size: 36;}" +
	"[zoom = 15]{text-size: 43;}" +
	"[zoom = 16]{text-size: 50;}" +
	"[zoom = 17]{text-size: 58;}" +
	"[zoom = 18]{text-size: 67;}" +
	"[zoom = 9]{" +
		"[[county_nam] = 'Milwaukee'] {text-dx: 36;}"+
		"[[county_nam] = 'Ozaukee'] {text-dx: 36;}"+
		"[[county_nam] = 'Pepin'] {text-dy: -20;}"+
		"[[county_nam] = 'Trempealeau'] {text-dy: 23;}"+
	"}" +
	"[zoom = 8]{" +
		"[[county_nam] = 'Milwaukee'] {text-dx: 25;}"+
		"[[county_nam] = 'Ozaukee'] {text-dx: 25;}"+
		"[[county_nam] = 'Kewaunee'] {text-dx: 29;}"+
		"[[county_nam] = 'Door'] {text-dx: 29;}"+
		"[[county_nam] = 'Pepin'] {text-dy: -10;}"+
		"[[county_nam] = 'Trempealeau'] {text-dy: 23;}"+
		"[[county_nam] = 'Manitowoc'] {text-dy: -5;}"+
		"[[county_nam] = 'Marinette'] {text-dy: -5;}"+
		"[[county_nam] = 'Ashland'] {text-dy: 10;}"+
		"[[county_nam] = 'Crawford'] {text-dy: 10;}"+
	"}" +
	"[zoom = 7]{" +
		"[[county_nam] = 'Milwaukee'] {text-dx: 18;}"+
		"[[county_nam] = 'Door'] {text-dx: 18;}"+
		"[[county_nam] = 'Sheboygan'] {text-dx: 27;}"+
		"[[county_nam] = 'Ozaukee'] {text-dx: 18;}"+
		"[[county_nam] = 'Oconto'] {text-dy: 5;}"+
		"[[county_nam] = 'Adams'] {text-dy: -5;}"+
		"[[county_nam] = 'Juneau'] {text-dy: 7;}"+
		"[[county_nam] = 'Kewaunee'] {text-dx: 23;}"+
		"[[county_nam] = 'Pepin'] {text-dy: -5; text-dx: 1;}"+
		"[[county_nam] = 'Green Lake'] {text-size:7.5; text-align: right;}"+
		"[[county_nam] = 'Outagamie'] {text-size:8;}"+
		"[[county_nam] = 'Walworth'] {text-size:8;}"+
		"[[county_nam] = 'Waupacca'] {text-size:8;}"+
		"[[county_nam] = 'Washburn'] {text-size:8;}"+
		"[[county_nam] = 'Calumet'] {text-name: \"[county_nam].replace('Calu','Calu-\\n')\";}"+
		"[[county_nam] = 'Winnebago'] {text-name: \"[county_nam].replace('Winne','Winne-\\n')\";}"+
		"[[county_nam] = 'Waukesha'] {text-size:8;}"+
		"[[county_nam] = 'Manitowoc'] {text-dx: 27; text-dy: 4;}"+
		"[[county_nam] = 'Marinette'] {text-dy: 10;}"+
		"[[county_nam] = 'Ashland'] {text-dy: 5;}"+
		"[[county_nam] = 'Crawford'] {text-dy: -12;}"+
		"[[county_nam] = 'Marquette'] {text-name: \"[county_nam].replace('que','q-\\nue')\";}" +
		"[[county_nam] = 'La Crosse'] {text-name: \"[county_nam].replace('a C','a\\nC')\";}" +
		"[[county_nam] = 'Menominee'] {text-name: \"[county_nam].replace('omin','-\\nomin-\\n')\"; text-size:8; text-align: right; text-line-spacing: -1;}" +
		"[[county_nam] = 'Trempealeau'] {text-name: \"[county_nam].replace('peal','-\\npeal-\\n')\";}" +
	"}" +
	//"text-dy: 50;" +
"}"




isItMobile = detectMobile();
console.log (isItMobile);
if (isItMobile == false){
	southWest = L.latLng(42.301420, -95.451081),
	northEast = L.latLng(47.016127, -83.751573),
	bounds = L.latLngBounds(southWest, northEast)
	if (embedded){
		var map = L.map('map', {
          maxBounds: bounds,
		  minZoom: 7,
			maxZoom: 14,
		  // true by default, false if you want a wild map
          sleep: true,
          // time(ms) for the map to fall asleep upon mouseout
          sleepTime: 2500,
          // time(ms) until map wakes on mouseover
          wakeTime: 750,
          // defines whether or not the user is prompted oh how to wake map
          sleepNote: true,
          // should hovering wake the map? (clicking always will)
          hoverToWake: false,
          // opacity (between 0 and 1) of inactive map
          sleepOpacity: .6
      }).setView([44.785734,-89.837036], 7);
	}else{
		var map = L.map('map',{
			maxBounds: bounds,
			minZoom: 7,
			maxZoom: 14
		}).setView([44.785734,-89.837036], 7);
	}
}else{  // it is a mobile
	document.getElementById('map').setAttribute("style","height:500px");
	southWest = L.latLng(38.301420, -95.451081),
  northEast = L.latLng(53.016127, -83.751573),
	bounds = L.latLngBounds(southWest, northEast)
	if (embedded){
		var map = L.map('map', {
          maxBounds: bounds,
		  minZoom: 6,
			maxZoom: 14,
		  // true by default, false if you want a wild map
          sleep: false,
          // time(ms) for the map to fall asleep upon mouseout
          sleepTime: 750,
          // time(ms) until map wakes on mouseover
          wakeTime: 750,
          // defines whether or not the user is prompted oh how to wake map
          sleepNote: true,
          // should hovering wake the map? (clicking always will)
          hoverToWake: false,
          // opacity (between 0 and 1) of inactive map
          sleepOpacity: .6
      }).setView([46.785734,-89.837036], 6);
	}else{
		var map = L.map('map',{
			maxBounds: bounds,
			minZoom: 6,
			maxZoom: 14
		}).setView([44.785734,-89.837036], 6);
	}
}

var tonerUrl = "https://stamen-tiles.a.ssl.fastly.net/toner-background/{Z}/{X}/{Y}.png";
var labelUrl = "https://stamen-tiles.a.ssl.fastly.net/toner-labels/{Z}/{X}/{Y}.png";
var url = tonerUrl.replace(/({[A-Z]})/g, function(s) {
    return s.toLowerCase();
});
var url2 = labelUrl.replace(/({[A-Z]})/g, function(s) {
    return s.toLowerCase();
});

var basemap = L.tileLayer(url, {
    subdomains: ['','a.','b.','c.','d.'],
    minZoom: 0,
    maxZoom: 14,
    type: 'png',
		opacity: 0.25,
    attribution: 'LiDAR Inventory by <a href="https://www.sco.wisc.edu/">SCO</a>, DOA. Map tiles by <a href="http://stamen.com">Stamen Design</a>'
}).addTo(map);

/// road labels
var topLayer = L.tileLayer(url2, {
    subdomains: ['','a.','b.','c.','d.'],
    minZoom: 10,
    maxZoom: 14,  //20
    type: 'png'
}).addTo(map);

var cartoCounty = cartodb.createLayer(map, {
  user_name: 'sco-admin',
  type: 'cartodb',
  maxZoom: 15,
  sublayers: [{type: "cartodb",
		sql: 'SELECT * FROM bordner_county_bnds',
		cartocss: cartoCSSCounty
}]
},{ https: true })

//cartolayer has the border county_poly with label_names
cartoCounty.addTo(map).on('done', function(layer) {
   cartoCountyLayer = layer
   setTimeout(reLayerStuff, 500)
});


////////////////////////////////////////////


var legend = L.control({position: 'topright'});

legend.onAdd = function (map) {
  // estimate statistics and report in legend box
	var div = L.DomUtil.create('div', 'info legend'),
		grades = [2, 1, 0],
		labelLabel = ["<b class='legend-class'>No Lidar Data Yet</b>",
	              	"<b class='legend-class'>County</b>",
							    "<b class='legend-class'>WisconsinView</b>"],
		labels = [],
		from, to;

	for (var i = 2; i >= 0; i--) { //}< grades.length; i++) {
		from = grades[i];
		labels.push(
			'<i style="background:' + getColor(from) + '"></i> ' + labelLabel[i]);
	}

	div.innerHTML = '<h4>LiDAR Source:</h4>' + labels.join('<br>')
	return div;
};
//});

legend.addTo(map);


//////
// control that shows county liDAR info on hover
var info = L.control();

info.onAdd = function (map) {
	console.log(this)
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	var isItMobile2 = detectMobile();
	if (isItMobile2 == false){
	    actionVar = "Click on"
	}else{
		  actionVar = "Tap on"
	}
	this._div.innerHTML = (
	props ?
		'<div class="popup-div">\
			<text style="font-size:16px; line-height:16px;"><b>' + props.name + ' County <br>\
			<hr>\
			<text style="font-size:14px; line-height:14px;"> WisconsinView LiDAR Data </b></text><br>\
			<text style="font-size:11px; line-height:11px;">\
				<b>Year of acquisition: </b>'+ props.DATA.adq + '<br>\
				<b>WisconsinView FTP: </b>' + props.DATA.url + '<b> HTTP: </b>' + props.DATA.http + '<br>\
				<b>Classified LAS: </b>' + props.DATA.las + '<br>\
				<b>Bare Earth: </b>' + props.DATA.bare_earth + '<br>\
				<b>Breaklines: </b>' + props.DATA.breaklines + '<br>\
				<b>Contours: </b>' + props.DATA.contours + '<br>\
				<b>Tile DEMs: </b>' + props.DATA.Tile_dem + '<br>\
				<b>County DEM: </b>' + props.DATA.Co_DEM + '<br>\
				<b>Terrain: </b>' + props.DATA.terrain + '<br>\
				<b>DSM: </b>' + props.DATA.DSM + '<br>\
				<b>Metadata/Control Report: </b>' + props.DATA.Mdata + '<br>\
				<b>Notes: </b>' +	props.DATA.notes + '\
			</text>\
			<hr>\
			<text style="font-size:14px; line-height:14px;">\
				<b>' + props.name + ' County LiDAR Data/Info </b><br>\
			</text>\
			<text style="font-size:11px; line-height:11px;">\
				<b> County URL: </b>' + props.DATA.co_url + '<br>\
				<b>Data available for download: </b>' + props.DATA.data + '<br>\
				<b>Notes: </b>' + props.DATA.notes2 + '<br>\
			</text>\
			<hr>\
			<text style="font-size:14px; line-height:14px;">\
				<b>' + props.name + ' County LiDAR Tile Index</b><br>\
			</text>\
			<text style="font-size:11px; line-height:11px;">\
				<b>Interactive tile index for: </b><br>' + (props.DATA.Tile_search||props.DATA.Tile_index) + '\
			</text>\
		</div>'
		: actionVar + ' an area.'
	);
};

//if (isItMobile == false){
info.addTo(map);
console.log(info)
//}

geojson = L.geoJson(statesData, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);


function detectMobile() {
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		return true;
	}else{
		return false;
	}
}


function reLayerStuff(){
	var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
	topPane.appendChild(cartoCountyLayer.getContainer());
	cartoCountyLayer.setZIndex(8);
}

// get color depending on year of data -- from color brewer
function getColor(d) {
	return d == 2  ? '#a6cee3' :  // future light blue
		     d == 1  ? '#1f78b4' :  // county blue  #
	                 '#b2df8a'; // wisconisn view  green
}

function style(feature) {
	return {
		weight: 0.75,
		opacity: 1,
		color: '#4dac26',//'white',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties.DATA.inWW)
	};
}

function highlightFeature(e) {
	var layer = e.target;

		geojson.eachLayer(function(marker) {
			geojson.resetStyle(marker);
			marker.bringToBack();
		})

		if(layer.feature.properties.DATA.inWW == 2){
			layer.setStyle({
				weight: 1.5,
				fillColor: '#a0b6c2',  //a0b6c2
				dashArray: '',
				fillOpacity: 0.7
			});
		}
	  if (layer.feature.properties.DATA.inWW == 1){
			layer.setStyle({
				weight: 1.5,
				fillColor: '#5687a8', //#7195af',  //5687a8 or 5c88a6
				dashArray: '',
				fillOpacity: 0.7
			});
		}
	  if(layer.feature.properties.DATA.inWW == 0){
			layer.setStyle({
				weight: 1.5,
				fillColor: '#80ab6f',  // a6bc92   a4b892
				dashArray: '',
				fillOpacity: 0.7
			});
		}
	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
	info.update(layer.feature.properties);
}

function resetHighlight(e) {
	console.log(e)
	geojson.resetStyle(e.target);
	e.target.bringToBack();
	info.update();
}

//function zoomToFeature(e) {
//	map.fitBounds(e.target.getBounds());
//}


function onEachFeature(feature, layer) {
	//csf(feature);
  isItMobile = detectMobile();
	if (isItMobile == false){   //same?  review this section
		layer.on({
			//mouseover: highlightFeature,
			//mouseout: resetHighlight//,
			click: highlightFeature //zoomToFeature
		});
	}else{
		layer.on({
			click: highlightFeature
		});
	}
}
