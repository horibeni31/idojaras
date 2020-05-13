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
var ws = new WebSocket("ws://ip.idojaras.live:1264");

document.getElementById("dt-from").defaultValue = "2014-02-09";
document.getElementById("dt-to").defaultValue = "2020-05-14";

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
function RefreshData() {
	var type = cmbmap[document.getElementById("drp").options[document.getElementById("drp").selectedIndex].value];

	var dtfrom = new Date(document.getElementById("dt-from").value);
	var dtto = new Date(document.getElementById("dt-to").value);
	var message = {};
	message.type = "thsp";
	message.data = {};
	message.data.type = type;
	message.data.from = dtfrom;
	message.data.to = dtto;
	var msg = JSON.stringify(message)
	ws.send(msg);
	RefreshOther()
	RefreshDirection();
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
	RefreshData();


};
ws.onerror = function (err) {
	console.log('err: ', err);
}
ws.onmessage = function (event) {
	//	console.log(event.data);
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

			values[dirmap[parseFloat(msg.data[i].direction).toFixed(1)]] = msg.data[i].sp;
			//	//addData(myChart, msg.data[i].direction, msg.data[i].sp);

			//addData(myChart, key, values[key]);

		}
		for (var key in values) {
			addData(myChart, key, values[key]);

		}



	} else if (msg.type == "thsp") {
		clearData(myChart2);
		for (var i = 0; i < msg.data.length; i++) {
			addData(myChart2, msg.data[i].date, msg.data[i].value);
		}
	} else if (msg.type == "other") {
		var cmb = document.getElementById("drp");
		var cmbtype = cmb.options[cmb.selectedIndex].value;
		console.log(msg.data.type);
		var dtype = msg.data.type == "avg" ? "Átlag " : msg.data.type == "min" ? "Minimum " : "Maximum ";
		document.getElementById(msg.data.type).innerHTML = dtype + " " + cmbtype + ": " + msg.data.data[0].field;
	}


};
ws.onclose = function () {
	console.log("Connection is closed...");
}