google.charts.load('current', {'packages':['sankey']});
// google.charts.setOnLoadCallback(drawChart);
// google.charts.setOnLoadCallback(function() {
//     drawChart(JSON.parse(jsonData))
// });
let showCategories =     false;
let showOnlyCategories = false;


//set functionality for buttons
let showCatsToggle = document.getElementById("showCatsToggle");
let onlyCatsToggle = document.getElementById("onlyCatsToggle");
let filtersInputStarts = document.getElementById("filtersInputStartpoints");
let filtersInputEnds = document.getElementById("filtersInputEndpoints");
let filtersCats = document.getElementById("filtersCats");

let applyBtn = document.getElementById("applyBtn");

showCatsToggle.checked = showCategories;
onlyCatsToggle.checked = showOnlyCategories;


applyBtn.onclick = function (element) {
    showCategories = showCatsToggle.checked;
    showOnlyCategories = onlyCatsToggle.checked;
    filterListStarts = filtersInputStarts.value;
    filterListEnds = filtersInputEnds.value;
    filterListCats = filtersCats.value;
    // you must turn on categories if you want to filter by category
    if (filterListCats != "" ) {
        showCategories = true;
        showCatsToggle.checked = showCategories;
    }
    
    filteredData = filterDataByStartpoints(filterListStarts,jsonData);
    // this may be the most inefficient possible way of doing this
    filteredData = filterDataByEndpoints(filterListEnds,JSON.stringify(filteredData));
    if (showCategories) {
        filteredData = filterDataIntoCategories(JSON.stringify(filteredData));
        //if you want to filter by category, filter by category
        if (filterListCats != "") {
            filteredData = filterDataByCategory(filterListCats, JSON.stringify(filteredData));
        }
    }

    // now redraw chart!
    drawChart(filteredData);
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
    // console.log(inputData);
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

function filterDataIntoCategories(inputData) {
    var newThing = JSON.parse(inputData, function (key, value) {
        if (typeof value != 'string') {
            return value;
        }
        var element = value.split(" ");
        if (element.length != 2) {
            return value;
        }
        // now we check what category it would be in and deal with it
        let thisCategory = "Unknown";
        let categories = services["categories"];
                    let found = false;
                    if (element[0].includes("github")) {
                        thisCategory = "GitHub";
                        found = true;
                    } else if (element[0].includes("google")) {
                        thisCategory = "Google";
                        found = true;
                    } else if (element[0].includes("aws") || element[1].includes("amazon")) {
                        thisCategory = "Amazon";
                        found = true;
                    } else if (element[0].includes("cloudfront")) {
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
                                        if (domains.includes(element[0])) {
                                            if (category == "Disconnect") {
                                                thisCategory = website;
                                            } else {
                                                thisCategory = category;
                                            }
                                            found = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
        // if recognized, put into a category
        if (thisCategory != "Unknown") {
            element[0] = thisCategory;
        } 
        // if unrecognized, only set category if user has asked to only display categorized things
        else if (showOnlyCategories) {
            element[0] = thisCategory;
        }
        return element[0] + " " + element[1];
        
    });

    return newThing;
}

function filterDataByCategory(categories, inputData) {
    catsToShow = categories.split(" ");
    var newThing = JSON.parse(inputData, function (key, value) {
        // if pass in empty string default to use normal dataset.
        if (categories == "") {
            return value;
        }
        if (typeof value != 'string') {
            return value;
        }
        var splitVal = value.split(" ");
        if (splitVal.length != 2) {
            return value;
        }
        for (i = 0; i < catsToShow.length; i++) {
            if (splitVal[0] == catsToShow[i]) {
                return value;
            }    
        }
        
    });
    return newThing;
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
                
                if (!firstParties.includes(element[1])) {
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