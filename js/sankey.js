google.charts.load('current', {'packages':['sankey']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
var data = new google.visualization.DataTable();
data.addColumn('string', 'From');
data.addColumn('string', 'To');
data.addColumn('number', 'Weight');

//jsonData should be set in a previous script
let includeBlocked = false;
console.log(jsonData);
let scopeData = JSON.parse(jsonData);

for (let thing in scopeData) {
    if (thing.includes("month")) {
        let firstParties = scopeData[thing]["all1st"];
        let connections = scopeData[thing]["allConnected3rd"];
        let blocked = scopeData[thing]["allBlocked3rd"];
        // console.log(blocked);
        // console.log(connections);
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
            
            let thisCategory = "Unknown";
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
            if (!firstParties.includes(element[1])) {
                if (thisCategory !== "Unknown") {
                    console.log("Replacing",element[1],thisCategory)
                    element[1] = thisCategory;
                }
                data.addRows([element]);
            }
        });
    }
}
// Sets chart options.
var options = {
    //width: 600,
};
console.log(data);
// Instantiates and draws our chart, passing in some options.
var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
chart.draw(data, options);
}