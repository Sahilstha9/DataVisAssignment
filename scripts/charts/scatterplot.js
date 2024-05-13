function init() {
    var w = 1500;
    var h = 700;

    var combinedData = [];

    d3.csv("./data/LifeExpectancy.csv").then(function (data) {
        d3.csv("./data/HealthExpenditurePercentage.csv").then(function (dataset) {
            for (var i = 0; i < data.length; i++) {
                var lifeCountry = data[i].Country;
                var healthCountry = dataset[i].Country;

                if (lifeCountry == healthCountry) {
                    var json = { country: lifeCountry };
                    for (var j = 2015; j < 2023; j++) {
                        json["lifeExpectancyY" + j.toString()] = parseFloat(data[i]["Y" + j.toString()]);
                        json["healthExpenditureY" + j.toString()] = parseFloat(dataset[i]["Y" + j.toString()]);
                    }
                    combinedData.push(json);
                }

            }
            console.log(combinedData);
        });
    });


}

window.onload = init;