google.charts.load('current', {'packages':['sankey']});
// google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(function() {
    drawChart(JSON.parse(jsonData))
});

function drawChartForOnlyOneEndpoint(endpoint) {
    console.log("do a thing");
    var newThing = JSON.parse(jsonData, function (key, value) {
        if (typeof value != 'string') {
            return value;
        }
        var splitVal = value.split(" ");
        if (splitVal.length != 2) {
            return value;
        }
        if (splitVal[1] == endpoint) {
            //so if a string with two parts and the first equals our endpoint, return
            console.log("use this one!");
            return value;
        }
    });
    console.log("new data is" + newThing);
    console.log(newThing);
    // console.log("old data is : ");
    // console.log(JSON.parse(jsonData));
    drawChart(newThing);
}

function drawChart(parsedJsonData) {
var data = new google.visualization.DataTable();
data.addColumn('string', 'From');
data.addColumn('string', 'To');
data.addColumn('number', 'Weight');
console.log(parsedJsonData);
//jsonData should be set in a previous script
let scopeData = parsedJsonData;
let includeBlocked = true;
for (let thing in scopeData) {
    if (thing.includes("month")) {
        let firstParties = scopeData[thing]["all1st"];
        let connections = scopeData[thing]["allConnected3rd"];
        let blocked = scopeData[thing]["allBlocked3rd"];
        console.log(blocked);
        console.log(connections);
        let total;
        if (includeBlocked) {
            total = connections.concat(blocked);
        } else {
            total = connections;
        }
        total.forEach(element => {
            element = element.split(" ");
            let temp = element[0];
            element[0] = element[1];
            element[1] = temp;
            element.push(1);
            if (!firstParties.includes(element[1])) {
                data.addRows([element]);
            }
        });
    }
}
// Sets chart options.
var options = {
    width: 600,
};

// Instantiates and draws our chart, passing in some options.
var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
chart.draw(data, options);
}