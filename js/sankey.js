google.charts.load('current', {'packages':['sankey']});
// google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(function() {
    drawChart(JSON.parse(jsonData))
});
let showCategories =     true;
let showOnlyCategories = true;
let filterList = ""

//set functionality for buttons
let showCatsToggle = document.getElementById("showCatsToggle");
let onlyCatsToggle = document.getElementById("onlyCatsToggle");
let filtersInputStarts = document.getElementById("filtersInputStartpoints");
let filtersInputEnds = document.getElementById("filtersInputEndpoints");
let applyBtn = document.getElementById("applyBtn");

showCatsToggle.checked = showCategories;
onlyCatsToggle.checked = showOnlyCategories;

applyBtn.onclick = function (element) {
    showCategories = showCatsToggle.checked;
    showOnlyCategories = onlyCatsToggle.checked;
    filterListStarts = filtersInputStarts.value;
    filterListEnds = filtersInputEnds.value;
    console.log("filters are: " + filterListStarts);
    // now redraw chart!
    // drawChartForOnlyOneEndpoint(filterList);
    
    filteredData = filterDataByStartpoints(filterListStarts,jsonData);
    // this may be the most inefficient possible way of doing this
    filteredFilteredData = filterDataByEndpoints(filterListEnds,JSON.stringify(filteredData));
    drawChart(filteredFilteredData);
}

////////// makesure the checkboxes stay sane ///
onlyCatsToggle.onclick = function (element) {
    if (onlyCatsToggle.checked) {
        console.log("true");
        // must turn on categories if you want to show only categories
        showCatsToggle.checked = true;
    } else {
        console.log("false");
    }
}

showCatsToggle.onclick = function (element) {
    if (!showCatsToggle.checked) {
        // cant show only categories if you dont show categories
        onlyCatsToggle.checked = false;
    }
}

/////////////////////////////////////////////////

function filterDataByStartpoints(startpoints, inputData) {
    console.log(inputData);
    pointsToShow = startpoints.split(" ");
    var newThing = JSON.parse(inputData, function (key, value) {
        // if pass in empty string default to use normal dataset.
        if (startpoints == "") {
            return value;
        }
        if (typeof value != 'string') {
            return value;
        }
        var splitVal = value.split(" ");
        if (splitVal.length != 2) {
            return value;
        }
        for (i = 0; i < pointsToShow.length; i++) {
            if (splitVal[1] == pointsToShow[i]) {
                //so if a string with two parts and the first equals our endpoint, return
                // console.log("use this one!");
                return value;
            }    
        }
        
    });
    // console.log(newThing);
    return newThing;
    // drawChart(newThing);
}



function filterDataByEndpoints(endpoints, inputData) {
    pointsToShow = endpoints.split(" ");
    var newThing = JSON.parse(inputData, function (key, value) {
        // if pass in empty string default to use normal dataset.
        if (endpoints == "") {
            return value;
        }
        if (typeof value != 'string') {
            return value;
        }
        var splitVal = value.split(" ");
        if (splitVal.length != 2) {
            return value;
        }
        for (i = 0; i < pointsToShow.length; i++) {
            if (splitVal[0] == pointsToShow[i]) {
                //so if a string with two parts and the first equals our endpoint, return
                // console.log("use this one!");
                return value;
            }    
        }
        
    });
    // console.log(newThing);
    // drawChart(newThing);
    return newThing;
}

function drawChartForOnlyOneStartpoint(startpoint,inputData) {
    var newThing = JSON.parse(inputData, function (key, value) {
        // if pass in empty string, use normal dataset. this is mostly for testing
        if (startpoint == "") {
            return value;
        }
        if (typeof value != 'string') {
            return value;
        }
        var splitVal = value.split(" ");
        if (splitVal.length != 2) {
            return value;
        }
        if (splitVal[1] == startpoint) {
            //so if a string with two parts and the first equals our endpoint, return
            // console.log("use this one!");
            return value;
        }
    });
    console.log(newThing);
    drawChart(newThing);
    // return newThing;
}

function drawChart(parsedJsonData) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'From');
    data.addColumn('string', 'To');
    data.addColumn('number', 'Weight');
    console.log(parsedJsonData);

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
                if (typeof element != 'string') {
                    console.log("herp derp, im not a string");
                    return;
                }
                element = element.split(" ");
                let temp = element[0];
                element[0] = element[1];
                element[1] = temp;
                element.push(1);
                let thisCategory = "Unknown";
                if (showCategories) {
                    let categories = services["categories"];
                    let found = false;
                    if (element[1].includes("github")) {
                        thisCategory = "GitHub";
                        found = true;
                    } else if (element[1].includes("google")) {
                        thisCategory = "Google";
                        found = true;
                    } else if (element[1].includes("aws") || element[1].includes("amazon")) {
                        thisCategory = "Amazon";
                        found = true;
                    } else if (element[1].includes("cloudfront")) {
                        thisCategory = "Cloudfront";
                        found = true;
                    }
                    for (category in categories) {
                        if (found) {
                            break;
                        } else {
                            let companies = categories[category]; 
                            for (company in companies) {
                                let websites = companies[company];
                                for (website in websites) {
                                    let whyAreThereSoManyCategories = websites[website];
                                    for (why in whyAreThereSoManyCategories) {
                                        let domains = whyAreThereSoManyCategories[why];
                                        if (domains.includes(element[1])) {
                                            if (category == "Disconnect") {
                                                thisCategory = website;
                                            } else {
                                                thisCategory = category;
                                            }
                                            found = true;
                                            //console.log("Found", element[1],why,website,company,category)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (!firstParties.includes(element[1])) {
                    // only replace with category if you are showing categories
                    if (showCategories) {
                        if (showOnlyCategories) {
                            // console.log("Replacing",element[1],thisCategory);
                            element[1] = thisCategory;
                        }
                        // if not using only categories, only replace those you know
                        else if (thisCategory !== "Unknown") {
                            // console.log("Replacing",element[1],thisCategory);
                            element[1] = thisCategory;
                        }
                    }
                    data.addRows([element]);
                }
            });
        }
    }
    // Sets chart options.
    var options = {
        // width: 600,
    };

    // Instantiates and draws our chart, passing in some options.
    var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
    chart.draw(data, options);
}