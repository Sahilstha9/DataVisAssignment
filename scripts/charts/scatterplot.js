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

    text.append("h1").text("Identifying Opportunities for Health Investment: Causes of Death Stacked Bar Chart").style("text-align", "center").style("font-size", "24px").style("font-family", "Arial").style("color", "black");
    text.append("p").text("In our quest to understand the determinants of life expectancy and identify areas for targeted intervention, we now turn our attention to the distribution of causes of death across different countries. The stacked bar chart displayed below provides a comprehensive overview, with each bar representing a country and the stacked segments depicting various causes of death.");
    text.append("p").text("By examining this visualization, we gain valuable insights into the leading causes of mortality and their relative impact on life expectancy in different regions. The segments of each bar represent categories such as infectious diseases, non-communicable diseases, accidents, and other factors contributing to mortality.");
    text.append("p").text("As we analyze the data, certain patterns and trends emerge. For instance, in many developing countries, infectious diseases such as malaria, tuberculosis, and respiratory infections constitute a significant proportion of total deaths. This highlights the ongoing challenges in combating infectious diseases and the urgent need for investment in public health infrastructure, disease prevention, and access to essential healthcare services.");
    text.append("p").text("In contrast, in more developed regions, non-communicable diseases such as cardiovascular diseases, cancer, and diabetes often account for a larger share of mortality. These conditions are often linked to lifestyle factors, including diet, physical activity, and access to healthcare. Thus, interventions aimed at reducing the burden of non-communicable diseases may require targeted strategies focusing on health promotion, early detection, and chronic disease management.");
    text.append("p").text("Furthermore, the stacked bar chart allows for comparisons between countries, enabling us to identify variations in the distribution of causes of death and potential areas for improvement. By targeting the specific causes contributing most significantly to mortality in each country, policymakers and healthcare providers can develop tailored interventions to address the underlying factors and improve life expectancy.");
    text.append("p").text("In conclusion, the insights derived from this visualization underscore the importance of strategic investment in healthcare systems, public health initiatives, and disease prevention efforts. By understanding the complex interplay of factors influencing mortality and life expectancy, we can better prioritize resources and interventions to maximize their impact on population health and well-being.");

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


    text.transition().duration(2000).style("opacity", 1);

}
window.onload = init;