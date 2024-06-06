var h = 600;
var w;
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

    var text = d3.select("body").append("div").attr("class", "container").style("opacity", 0);

    text.append("h1").text("Exploring the Relationship Between Health Expenditure and Life Expectancy").style("text-align", "center").style("font-size", "24px").style("font-family", "Arial").style("color", "black");
    text.append("p").text("As we delve deeper into understanding the factors influencing life expectancy, we turn our attention to the relationship between health expenditure and longevity. The scatter plot displayed below juxtaposes life expectancy against the share of GDP allocated to healthcare spending for various countries.");
    text.append("p").text("This visualization allows us to examine whether higher levels of investment in healthcare correspond to longer life expectancies. Each data point represents a country, with the x-axis indicating the percentage of GDP dedicated to health expenditure and the y-axis representing life expectancy.");
    text.append("p").text("Upon initial examination, we observe a general trend indicating that countries with a higher share of GDP allocated to healthcare tend to have longer life expectancies. This suggests that investment in healthcare infrastructure, medical services, and public health initiatives can positively impact population health outcomes.");
    text.append("p").text("However, as we scrutinize the scatter plot more closely, an intriguing insight emerges. While there is indeed a positive correlation between health expenditure and life expectancy, this relationship appears to plateau after a certain threshold. Notably, countries allocating more than 10% of their GDP to healthcare expenditure do not experience significant gains in life expectancy compared to those spending less.");
    text.append("p").text("This observation raises important questions about the efficiency and effectiveness of healthcare spending. It suggests that simply increasing the budget for healthcare may not necessarily lead to substantial improvements in life expectancy beyond a certain point. Instead, it underscores the importance of strategic allocation and targeted investments in healthcare systems to maximize the impact on population health.");
    text.append("p").text("By analyzing the data presented in this scatter plot, policymakers and healthcare professionals can gain valuable insights into how to optimize healthcare spending to achieve better health outcomes for their populations. It serves as a reminder that while financial investment is crucial, it must be coupled with innovative approaches and evidence-based practices to truly enhance life expectancy and well-being.");
    svg = d3.select("body").append("svg").attr("height", h).attr("opacity", 0);
    tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
    year = 2022;
    w = parseInt(svg.style("width"));
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
                .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 4) + ")")
                .style("text-anchor", "middle")
                .text("Health Expenditure (%)");

            svg.append("text")
                .attr("class", "axis-label")
                .attr("transform", "rotate(-90)")
                .attr("y", padding / 2)
                .attr("x", 0 - (h / 2))
                .style("text-anchor", "middle")
                .text("Life Expectancy");


        });
    });

    var slider = d3.select("body").append("section").attr("class", "slider");
    slider.append("p").attr("id", "currentValue").text("2022");
    slider.append("p").text("2015");
    slider.append("input").attr("type", "range").attr("name", "year").attr("id", "year").attr("min", "2015").attr("max", "2022").attr("value", "2022").attr("width", "100%")
        .on("change", function (d, i) {
            updateScatterPlotChart(document.getElementById('year').value);
        });
    slider.append("p").text("2022");

    var legend = d3.select("body").append("svg").attr("width", 250).attr("height", 150).attr("id", "legend").attr("opacity", 0);
    legend.append("rect").attr("x", padding).attr("y", 10).attr("width", 15).attr("height", 15).style("fill", "#06ACF9");
    legend.append("circle").attr("cx", padding + 7).attr("cy", padding + 10).attr("r", 9).style("fill", "#f95306");
    legend.append("text").text("- Non OECD Countries").attr("x", padding + 30).attr("y", padding + 15).style("fill", "black");
    legend.append("text").text("- OECD Countries").attr("x", padding + 30).attr("y", 23).style("fill", "black");

    svg.transition()
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .style("transform", "translateY(0)")
        .style("opacity", 1);

    legend.transition()
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .style("transform", "translateY(0)")
        .style("opacity", 1);

    text.transition().duration(2000).style("opacity", 1);

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

    console.log(event.pageX);

    var tooltipX = event.pageX > 1000 ? event.pageX - 250 : event.pageX + 10; // Offset the tooltip to the right
    var tooltipY = event.pageY > 800 ? event.pageY - 600 : event.pageY - 550;
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