// Build system: node.js 10.16.2

// Import old metadata
var fs = require("fs")
var vm = require('vm')
vm.runInThisContext(fs.readFileSync(__dirname + "/old_metadata.js"))

// console.log(metadata["adams"])

var output = {};

// Iterate through deliveries
for (const delivery in metadata) {
	// Initiate new delivery
	const newDelivery = {
		name: metadata[delivery].name,
		year: metadata[delivery].deliveryYear,
		datasets: []
	};

	// Add datasets
	for (const key in metadata[delivery]) {
		dataset:
		if (['name','deliveryName','deliveryYear'].includes(key) !== true) {

			// Figure out if dataset is string
			var dataset = metadata[delivery][key];
			var isString = typeof dataset === 'string' || dataset instanceof String

			// If dataset is not string
			if (isString !== true) {
				for (const filetypeKey in dataset) {
					var tiled = (typeof dataset[filetypeKey] === 'string' || dataset[filetypeKey] instanceof String) !== true;
					buildDataset(dataset, isString, tiled, filetypeKey)					
				}
			} else {
				buildDataset(dataset, isString, tiled=false)
			}

			function buildDataset(orginalDataset, datasetIsString, tiled, filetypeKey) {		
				// Initiate dataset variable
				var nameDict = {
					"classifiedPoints": "Classified Points",
					"bareEarthPoints": "Bare Earth Points",
					"demURLs": "DEM Raster",
					"dsmURLs": "DSM Raster",
					"breaklines": "Beaklines",
					"contours": "Contours",
					"deliveryFolder": "Delivery Folder"
				};
				var dataset = {
					name: nameDict[key],
					tiled: tiled
				};

				// Define baseURL and URLexts
				if (datasetIsString !== true) {

					// Add file type to name if multiple file types per dataset
					if (filetypeKey !== 'null') {
						dataset.name += ' ' + filetypeKey
					}

					if (typeof metadata[delivery][key][filetypeKey] === 'string' || metadata[delivery][key][filetypeKey] instanceof String) {
						console.log(metadata[delivery][key][filetypeKey])
						dataset.baseURL = metadata[delivery][key][filetypeKey];
					} else {
						dataset.baseURL = metadata[delivery][key][filetypeKey][0];
						dataset.URLexts = [];
						for (var i=1; i<metadata[delivery][key][filetypeKey].length; i++) {
							dataset.URLexts.push(metadata[delivery][key][filetypeKey][i]);
						}
					}
					
				} else {
					dataset.baseURL = metadata[delivery][key];
				}

				// Add dataset to new delivery if base URL not N/A
				if (dataset.baseURL !== 'N/A') {
					newDelivery.datasets.push(dataset);
				}
			}
		}
	}

	// Add new delivery to output
	output[delivery]=newDelivery;
	
}

// Write output to file
var outputString = `var metadata = ` + JSON.stringify(output, null, 2) + `;`
fs.writeFile('new_metadata.js', outputString, function(err) {
	console.log(err);
	console.log('Saved!');
})