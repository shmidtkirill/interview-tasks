var express = require('express');
var app = express();

var CONFIG = {
	POINTS: {
		QTY: 100,							// number of points
		MIN: -100,						// minimum value of a point
		MAX: 100,							// maximum value of a point
		UPDATE_INTERVAL: 20,	// interval between points update (ms)
		ARRAYS_NUM: 2					// number of arrays
	}
};

function getRandom(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function initPoints(arrayIndex) {
	arrays[arrayIndex].points = [];
	for (var pointIndex = 0; pointIndex < CONFIG.POINTS.QTY; pointIndex++) {
		arrays[arrayIndex].points[pointIndex] = getRandom(CONFIG.POINTS.MIN, CONFIG.POINTS.MAX);
	}
}

function updatePoints(arrayIndex) {
	arrays[arrayIndex].points.shift();
	arrays[arrayIndex].points.push(getRandom(CONFIG.POINTS.MIN, CONFIG.POINTS.MAX));
}

var arrays = [];
for (var arrayIndex = 0; arrayIndex < CONFIG.POINTS.ARRAYS_NUM; arrayIndex++) {
	arrays.push([]);
	initPoints(arrayIndex);
	setInterval(updatePoints, CONFIG.POINTS.UPDATE_INTERVAL, arrayIndex);
}

app.use(express.static('public'));

app.get('/api/v1/config', function (req, res) {
	res.json(CONFIG);
});

app.get('/api/v1/points/:id', function (req, res) {
	var id = req.params.id;
	if (arrays[id]) {
		res.json(arrays[id].points);
	}
});

app.listen(3000, function () {
	console.log('listening on port 3000');
});
