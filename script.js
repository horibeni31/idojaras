var dirmap = {}
dirmap["0.0"] = "É";
dirmap["22.5"] = "ÉÉK";
dirmap["45.0"] = "ÉK";
dirmap["67.5"] = "ÉKK";
dirmap["90.0"] = "K";
dirmap["112.5"] = "DKK";
dirmap["135.0"] = "DK";
dirmap["157.5"] = "DDK";
dirmap["180.0"] = "D";
dirmap["202.5"] = "DDNY";
dirmap["225.0"] = "DNY";
dirmap["247.5"] = "DNYNY";
dirmap["270.0"] = "NY";
dirmap["292.5"] = "ÉNYNY";
dirmap["315.0"] = "ÉNY";
dirmap["337.5"] = "ÉÉNY";

var cmbmap = {
	"hőmérséklet": "temperature",
	"szélsebesség": "speed",
	"páratartalom": "humidity",
	"légnyomás": "pressure"
};
for (var key in cmbmap) {

	var option = document.createElement("option");
	option.text = key;
	document.getElementById("drp").add(option);
}
var days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
var d = new Date();

var dayName = days[d.getDay()];
document.getElementById("time").innerHTML = dayName + "\n" + d.toLocaleTimeString();
var myVar = setInterval(myTimer, 1000);

var now = new Date();


var datefrom = new Date(new Date().setDate(new Date().getDate() - 30));
var dateto = new Date(new Date().setDate(new Date().getDate() + 0));


document.getElementById("dt-from").defaultValue = datefrom.toISOString().slice(0, 10);
document.getElementById("dt-to").defaultValue = dateto.toISOString().slice(0, 10);

function myTimer() {
	var d = new Date();
	var dayName = days[d.getDay()];
	document.getElementById("time").innerHTML = dayName + "\n" + d.toLocaleTimeString();
}
var ws = new WebSocket("ws://ip.idojaras.live:1264");


function addData(chart, label, data) {
	chart.data.labels.push(label);
	chart.data.datasets[0].data.push(data);
	chart.update();
}
function clearData(chart) {

	var le = chart.data.labels.length;
	for (var a = 0; a < le; a++) {

		chart.data.labels.pop();
	}
	le = chart.data.datasets[0].data.length;
	for (var b = 0; b < le; b++) {
		chart.data.datasets[0].data.pop();
	}

	chart.update();
}
function RefreshAll() {
	RefreshTHSP();

	RefreshDirection();
}
function RefreshTHSP() {
	console.log("refreshing thsp..");
	var type = cmbmap[document.getElementById("drp").options[document.getElementById("drp").selectedIndex].value];

	var dtfrom = new Date(document.getElementById("dt-from").value);
	var dtto = new Date(document.getElementById("dt-to").value);
	var message = {};
	message.type = "thsp";
	message.intervall =  document.getElementById("myRange").value * 15 * 60 * 1000;
	message.data = {};
	message.data.type = type;
	message.data.from = dtfrom;
	message.data.to = dtto;
	var msg = JSON.stringify(message)
	ws.send(msg);
	RefreshOther()
}
function RefreshOther() {
	var type = cmbmap[document.getElementById("drp").options[document.getElementById("drp").selectedIndex].value];

	var dtfrom = new Date(document.getElementById("dt-from").value);
	var dtto = new Date(document.getElementById("dt-to").value);
	var message = {};
	message.type = "other";
	message.data = {};
	message.data.type = type;
	message.data.from = dtfrom;
	message.data.to = dtto;
	var msg = JSON.stringify(message);
	ws.send(msg);
	myChart2.options.title.text = document.getElementById("drp").options[document.getElementById("drp").selectedIndex].value;
console.log("refreshign other...");

}
function RefreshDirection() {
	var dtfrom = new Date(document.getElementById("dt-from").value)
	var dtto = new Date(document.getElementById("dt-to").value)
	var message = {}
	message.type = "dir";
	message.data = {};
	message.data.from = dtfrom;
	message.data.to = dtto;
	var msg = JSON.stringify(message)
	ws.send(msg);

}

ws.onopen = function (event) {
	console.log('Connection is open ...');
	RefreshAll();


};
ws.onerror = function (err) {
	console.log('err: ', err);
}
ws.onmessage = function (event) {
	//	console.log(event.data);
	//console.log(event.data);
	try {

		var msg = JSON.parse(event.data);





		if (msg.type == "dir") {
			clearData(myChart);
			var values = {};

			for (var key in dirmap) {
				values[dirmap[key]] = 0;
				//console.log(dirmap[key]);
				//		addData(myChart, dirmap[key],1	);

			}

			for (var i = 0; i < msg.data.length; i++) {

				values[dirmap[parseFloat(msg.data[i].dir).toFixed(1)]] = parseFloat(msg.data[i].sec / 3600.0).toFixed(2);
				//	//addData(myChart, msg.data[i].direction, msg.data[i].sp);

				//addData(myChart, key, values[key]);

			}
			for (var key in values) {
				addData(myChart, key, values[key]);

			}


		} else if (msg.type == "thsp") {

			clearData(myChart2);	
			console.log(msg.data)
			for (var i = 0; i < msg.data.length; i++) {		
				addData(myChart2, msg.data[i].date, msg.data[i].value);			
			}

		} else if (msg.type == "other") {
			var cmb = document.getElementById("drp");
			var cmbtype = cmb.options[cmb.selectedIndex].value;
			//	console.log(msg.data.type);
			var dtype = msg.data.type == "avg" ? "Átlag " : msg.data.type == "min" ? "Minimum " : "Maximum ";
			document.getElementById(msg.data.type).innerHTML = msg.data.data[0].field;
			document.getElementById(msg.data.type + "T").innerHTML = dtype + " " + cmbtype
		} else if (msg.type == "current") {
			//		document.getElementById("speed").innerHTML = msg.data.speed + "m/s";
			document.getElementById("dire").innerHTML = dirmap[msg.data.direction] + " " + msg.data.speed + "m/s";
			document.getElementById("hum").innerHTML = msg.data.humidity + " %";
			document.getElementById("press").innerHTML = msg.data.pressure + " Pa";
			document.getElementById("temp").innerHTML = msg.data.temperature + " °C";

		}
	} catch (ex) {

	}

};
function sliderChange() {
	RefreshTHSP();



}
function sliderDrag() {

	var val = document.getElementById("myRange").value;
	if (val * 15 <= 60) {
		console.log(document.getElementById("myRange").value * 30 + " perc");
		interval.innerHTML = document.getElementById("myRange").value * 15 + "-percenként";

	} else if (val == 48) {
		interval.innerHTML = "Naponta";


	} else {
		interval.innerHTML = parseFloat(document.getElementById("myRange").value * 15 / 60.0).toFixed(2) + "-óránként";
		console.log(parseFloat(document.getElementById("myRange").value * 15 / 60.0).toFixed(1) + " óra");


	}


}
ws.onclose = function () {
	console.log("Connection is closed...");
}