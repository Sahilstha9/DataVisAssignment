function init() {
    var w = 1500;
    var h = 700;

    var padding = 40;

    var combinedData = [];

    const oecdCountries = [
        "Australia",
        "Austria",
        "Belgium",
        "Canada",
        "Chile",
        "Colombia",
        "Costa Rica",
        "Czech Republic",
        "Denmark",
        "Estonia",
        "Finland",
        "France",
        "Germany",
        "Greece",
        "Hungary",
        "Iceland",
        "Ireland",
        "Israel",
        "Italy",
        "Japan",
        "Korea (South)",
        "Latvia",
        "Lithuania",
        "Luxembourg",
        "Mexico",
        "Netherlands",
        "New Zealand",
        "Norway",
        "Poland",
        "Portugal",
        "Slovak Republic",
        "Slovenia",
        "Spain",
        "Sweden",
        "Switzerland",
        "Turkey",
        "United Kingdom",
        "United States"
    ];

    d3.csv("./data/LifeExpectancy.csv").then(function (data) {
        d3.csv("./data/HealthExpenditurePercentage.csv").then(function (dataset) {
            for (var i = 0; i < data.length; i++) {
                var lifeCountry = data[i].Country;
                var healthCountry = dataset[i].Country;

                if (lifeCountry == healthCountry) {
                    var json = {
                        country: lifeCountry,
                        shape: "circle", // Add shape property
                        isOecd: oecdCountries.includes(lifeCountry) ? true : false, // Add category property
                    };
                    for (var j = 2015; j < 2023; j++) {
                        json["lifeExpectancyY" + j.toString()] = parseFloat(data[i]["Y" + j.toString()]);
                        json["healthExpenditureY" + j.toString()] = parseFloat(dataset[i]["Y" + j.toString()]);
                    }
                    combinedData.push(json);
                }
            }

            var xScale = d3.scaleLinear().domain([d3.min(combinedData, function (d) {
                return d.healthExpenditureY2022;
            }), d3.max(combinedData, function (d) {
                return d.healthExpenditureY2022;
            })]).range([padding, w - padding]);

            var yScale = d3.scaleLinear()
                .domain([d3.min(combinedData, function (d) { return d.lifeExpectancyY2022; }),
                d3.max(combinedData, function (d) { return d.lifeExpectancyY2022; })])
                .range([h - padding, padding]);

            var xAxis = d3.axisBottom().ticks(10).scale(xScale);
            var yAxis = d3.axisLeft().ticks(5).scale(yScale);
            var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

            svg.selectAll("circle")
                .data(combinedData)
                .enter().append("circle")
                .attr("cx", function (d) { return xScale(d.healthExpenditureY2022); })
                .attr("cy", function (d) { return yScale(d.lifeExpectancyY2022); })
                .attr("r", 5)
                .attr("fill", function (d) { return d[0] > 400 ? "red" : "slategrey"; })
                .on("mouseover", function (d, i) {
                    console.log(d.screenX);
                    // Show tooltip
                    svg.transition()
                        .duration(200)
                        .style("opacity", .9);
                    svg.append("text").text(i.country + "<br/>" + "Life Expectancy: " + i.lifeExpectancyY2022 + "<br/>" + "Health Expenditure: " + i.healthExpenditureY2022)
                        .style("transform", "translate(" + d.clientX + "px, " + d.clientY - 300 + "px)")
                        .style("display", "block");
                });

            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis);

            // Append axis labels and title
            svg.append("text")
                .attr("class", "axis-label")
                .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 2) + ")")
                .style("text-anchor", "middle")
                .text("Health Expenditure (%)");

            svg.append("text")
                .attr("class", "axis-label")
                .attr("transform", "rotate(-90)")
                .attr("y", padding / 2)
                .attr("x", 0 - (h / 2))
                .style("text-anchor", "middle")
                .text("Life Expectancy");

            // Add a title to the plot
            svg.append("text")
                .attr("class", "plot-title")
                .attr("x", w / 2)
                .attr("y", padding / 2)
                .attr("text-anchor", "middle")
                .text("Life Expectancy vs. Health Expenditure");

        });
    });

}

window.onload = init;
