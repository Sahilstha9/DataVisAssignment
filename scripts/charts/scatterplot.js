var w = 1800;
var h = 600;

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
    "Korea",
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

var svg, xScale, yScale, xAxis, yAxis, tooltip, year;

function init() {

    svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
    tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
    year = 2022;
    d3.csv("./data/LifeExpectancy.csv").then(function (data) {
        d3.csv("./data/HealthExpenditurePercentage.csv").then(function (dataset) {
            for (var i = 0; i < data.length; i++) {
                var lifeCountry = data[i].Country;
                var healthCountry = dataset[i].Country;

                if (lifeCountry == healthCountry) {
                    var json = {
                        country: lifeCountry,
                        isOecd: oecdCountries.includes(lifeCountry) ? true : false,
                    };
                    for (var j = 2015; j < 2023; j++) {
                        json["lifeExpectancyY" + j.toString()] = parseFloat(data[i]["Y" + j.toString()]);
                        json["healthExpenditureY" + j.toString()] = parseFloat(dataset[i]["Y" + j.toString()]);
                    }
                    combinedData.push(json);
                }
            }

            changeYear(2022);


            svg.selectAll('rect')
                .data(combinedData)
                .enter()
                .append("rect")
                .attr("class", "datapoint")
                .attr('x', function (d) { return xScale(d.healthExpenditureY2022) - 2.5; })
                .attr('y', function (d) { return yScale(d.lifeExpectancyY2022) - 2.5; })
                .attr('width', function (d) {
                    if (d.isOecd) {
                        return 7
                    }
                    return 0;
                })
                .attr('height', function (d) {
                    if (d.isOecd) {
                        return 7
                    }
                    return 0;
                })
                .attr('stroke', 'grey')
                .attr("stroke-width", 0.3)
                .attr('fill', '#06ACF9')
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);



            svg.selectAll("circle")
                .data(combinedData)
                .enter().append("circle")
                .attr("class", "datapoint")
                .attr("cx", function (d) { return xScale(d.healthExpenditureY2022); })
                .attr("cy", function (d) { return yScale(d.lifeExpectancyY2022); })
                .attr("r", function (d) {
                    if (!d.isOecd) {
                        return 5
                    }
                    return 0;
                }
                )
                .attr('stroke', 'grey')
                .attr("stroke-width", 0.3)
                .attr("fill", "#f95306")
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y-axis")
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

function handleMouseOut(event, d) {
    tooltip.selectAll("*").remove();
    tooltip.style("display", "none");
    svg.selectAll(".datapoint").style("opacity", 1);
    d3.select(this)
        .style("stroke", "grey")
        .style("stroke-width", 1);
}

function handleMouseOver(event, d) {
    svg.selectAll(".datapoint").style("opacity", 0.5);

    d3.select(this)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("opacity", 1);

    tooltip.append("text")
        .attr("x", 10)
        .attr("y", 20)
        .selectAll("tspan")
        .data([`Country: ${d.country}`, `Health Expenditure: ${d["healthExpenditureY" + year]}`, `Life Expectancy: ${d["lifeExpectancyY" + year]}`])
        .enter()
        .append("tspan")
        .attr("x", 10)
        .attr("dy", "1.2em")
        .text(d => d);

    var tooltipX = event.pageX > 1000 ? event.pageX - 250 : event.pageX; // Offset the tooltip to the right
    var tooltipY = event.pageY > 900 ? event.pageY - 550 : event.pageY - 250;
    tooltip.style("transform", "translate(" + tooltipX + "px, " + tooltipY + "px)")
        .style("display", "block");
}

function changeYear(year) {
    xScale = d3.scaleLinear().domain([d3.min(combinedData, function (d) {
        return d["healthExpenditureY" + year.toString()] - 1;
    }), d3.max(combinedData, function (d) {
        return d["healthExpenditureY" + year.toString()] + 1;
    })]).range([padding, w - padding]);

    yScale = d3.scaleLinear()
        .domain([d3.min(combinedData, function (d) { return d["lifeExpectancyY" + year.toString()] - 1; }),
        d3.max(combinedData, function (d) { return d["lifeExpectancyY" + year.toString()] + 1; })])
        .range([h - padding, padding]);

    xAxis = d3.axisBottom().ticks(10).scale(xScale);
    yAxis = d3.axisLeft().ticks(5).scale(yScale);

}

function updateScatterPlotChart(year) {
    this.year = year;
    document.getElementById('currentValue').textContent = year;
    changeYear(year);

    svg.select(".x-axis")
        .transition()
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .call(xAxis);

    svg.select(".y-axis")
        .transition()
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .call(yAxis);

    svg.selectAll("circle")
        .data(combinedData)
        .on("mouseover", handleMouseOver)
        .transition()
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .attr("cx", function (d) { return xScale(d["healthExpenditureY" + year.toString()]); })
        .attr("cy", function (d) { return yScale(d["lifeExpectancyY" + year.toString()]); })


    svg.selectAll("rect")
        .data(combinedData)
        .on("mouseover", handleMouseOver)
        .transition()
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .attr('x', function (d) { return xScale(d["healthExpenditureY" + year.toString()]) - 2.5; })
        .attr('y', function (d) { return yScale(d["lifeExpectancyY" + year.toString()]) - 2.5; })


}
window.onload = init;
