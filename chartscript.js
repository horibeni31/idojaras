var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
	type: 'polarArea',
	data: {
		labels: [],
		datasets: [{

			backgroundColor: 'rgba(60, 179, 113,0.6)',
			borderColor: 'rgba(57,50,94,1)',

			data: [],


			borderWidth: 1
		}]
	},

	options: {
			startAngle:- (90+11.25)/180*Math.PI,
		responsive: true,
		aspectRatio: 1.4,

		title: {
			display: true,
			text: 'Szélirány'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		legend: {
			display: false,

		},
		
	}

});
var ctx2 = document.getElementById('myChart2').getContext('2d');
var myChart2 = new Chart(ctx2, {
	type: 'line',
	data: {
		labels: [],
		datasets: [{

			backgroundColor: 'rgba(60, 179, 113,0.6)',
			borderColor: 'rgba(57,50,94,1)',

			data: [],


			borderWidth: 1
		}]
	},

	options: {
		responsive: true,
		aspectRatio: 1.4,

		title: {
			display: true,
			text: 'Hőmérséklet'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		legend: {
			display: false,

		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,

				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,

				}
			}]
		}
	}

});