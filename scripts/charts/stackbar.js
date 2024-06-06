var keys = [
    "Circulatory system",
    "Cancer",
    "Respiratory system",
    "External causes",
    "COVID-19",
];

var h = 700;// Increased width
var xPadding = 150,
    yPadding = 130; // Increased yPadding for better space for x-axis labels

var colorRange = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'];

// Set up the SVG container
function init() {
    var text = d3.select("body").append("div").attr("class", "container").style("opacity", 0);

    text.append("h1").text("Identifying Opportunities for Health Investment: Causes of Death Stacked Bar Chart").style("text-align", "center").style("font-size", "24px").style("font-family", "Arial").style("color", "black");
    text.append("p").text("In our quest to understand the determinants of life expectancy and identify areas for targeted intervention, we now turn our attention to the distribution of causes of death across different countries. The stacked bar chart displayed below provides a comprehensive overview, with each bar representing a country and the stacked segments depicting various causes of death.");
    text.append("p").text("By examining this visualization, we gain valuable insights into the leading causes of mortality and their relative impact on life expectancy in different regions. The segments of each bar represent categories such as infectious diseases, non-communicable diseases, accidents, and other factors contributing to mortality.");
    text.append("p").text("As we analyze the data, certain patterns and trends emerge. For instance, in many developing countries, infectious diseases such as malaria, tuberculosis, and respiratory infections constitute a significant proportion of total deaths. This highlights the ongoing challenges in combating infectious diseases and the urgent need for investment in public health infrastructure, disease prevention, and access to essential healthcare services.");
    text.append("p").text("In contrast, in more developed regions, non-communicable diseases such as cardiovascular diseases, cancer, and diabetes often account for a larger share of mortality. These conditions are often linked to lifestyle factors, including diet, physical activity, and access to healthcare. Thus, interventions aimed at reducing the burden of non-communicable diseases may require targeted strategies focusing on health promotion, early detection, and chronic disease management.");
    text.append("p").text("Furthermore, the stacked bar chart allows for comparisons between countries, enabling us to identify variations in the distribution of causes of death and potential areas for improvement. By targeting the specific causes contributing most significantly to mortality in each country, policymakers and healthcare providers can develop tailored interventions to address the underlying factors and improve life expectancy.");
    text.append("p").text("In conclusion, the insights derived from this visualization underscore the importance of strategic investment in healthcare systems, public health initiatives, and disease prevention efforts. By understanding the complex interplay of factors influencing mortality and life expectancy, we can better prioritize resources and interventions to maximize their impact on population health and well-being.");

    var svg = d3
        .select("body")
        .append("svg")
        .attr("height", h);
    var w = parseInt(svg.style("width"));

    // Load the CSV data
    d3.csv("./data/CauseofMortality.csv", function (d) {
        return {
            "Country": d.Country, // Parse as string
            "Circulatory system": +d["Circulatory system"],
            "Cancer": +d["Cancer"],
            "Respiratory system": +d["Respiratory system"],
            "External causes": +d["External causes"],
            "COVID-19": +d["COVID-19"],
        };
    })
        .then(function (data) {
            // Define the stack function
            var stack = d3
                .stack()
                .keys(keys);

            // Stack the data
            var stackedData = stack(data);

            // Set up the scales
            var yScale = d3
                .scaleBand()
                .domain(data.map(function (d) {
                    return d.Country;
                }))
                .range([yPadding, h - yPadding])
                .padding(0.1);

            var xScale = d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(stackedData, function (d) {
                        return d3.max(d, function (d) {
                            return d[1];
                        });
                    }) + 100,
                ])
                .range([xPadding, w - xPadding]);

            // Setting up axes
            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);

            // Set up the colors
            var colorScale = d3
                .scaleOrdinal()
                .domain(keys)
                .range(colorRange);

            // Create the legend
            var legend = svg.selectAll(".legend-item")
                .data(keys)
                .enter()
                .append("g")
                .attr("class", "legend-item")
                .attr("transform", function (d, i) {
                    return "translate(0," + (i * 20 + 80) + ")";
                });

            legend.append("rect")
                .attr("x", w - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", colorScale);

            legend.append("text")
                .attr("x", w - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) { return d; });

            // Create the stacked bars
            var bars = svg.selectAll(".layer")
                .data(stackedData)
                .enter()
                .append("g")
                .attr("class", "layer")
                .attr("fill", function (d) {
                    return colorScale(d.key);
                });

            bars.selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter()
                .append("rect")
                .attr("y", function (d) {
                    return yScale(d.data.Country);
                })
                .attr("class", "bars")
                .attr("x", xScale(0)) // Start from xScale(0) for animation
                .attr("width", 0) // Initial width is 0 for animation
                .attr("height", yScale.bandwidth())
                .on("mouseover", handleMouseOver)
                .on("mouseleave", function (event, d) {
                    d3.selectAll(".bars").style("opacity", 1);
                    // Hide tooltip
                    d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", 0)
                        .style("opacity", 1);
                    d3.select("#tooltip").style("display", "none");
                })
                .transition()
                .duration(1800) // Set the duration of the transition in milliseconds
                .attr("x", function (d) {
                    return xScale(d[0]);
                })
                .attr("width", function (d) {
                    return xScale(d[1]) - xScale(d[0]);
                });

            // Add axes
            svg.append("g")
                .attr("transform", "translate(0," + (h - yPadding) + ")")
                .call(xAxis)
                .selectAll("text")
                .attr("fill", "black")
                .attr("font-weight", "lighter")
                .attr("font-size", "15px");

            svg.append("g")
                .attr("transform", "translate(" + xPadding + ", 0)")
                .call(yAxis)
                .selectAll("text")
                .attr("transform", "translate(0,0) rotate(0)") // Ensure text is not rotated
                .style("text-anchor", "end") // Align text to end for better readability
                .attr("fill", "black")
                .attr("font-weight", "lighter")
                .attr("font-size", "15px");

            svg.append("text")
                .attr("class", "axis-label")
                .attr("transform", "translate(" + (w / 2) + " ," + (h - yPadding / 1.4) + ")")
                .style("text-anchor", "middle")
                .text("Health Expenditure (%)");

            text.transition().duration(2000).style("opacity", 1);
        })
        .catch(function (error) {
            console.log(error);
        });

    text.transition().duration(2000).style("opacity", 1);
}

function handleMouseOver(event, d) {

    d3.selectAll(".bars").style("opacity", 0.5);

    d3.select(this)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("opacity", 1);
    // Show tooltip
    d3.select("#tooltip")
        .style("display", "block")
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 100) + "px")
        .select("#value")
        .html(
            '<p id="Country">' +
            d.data.Country +
            '</p><br><p><span id="property">' +
            d3.select(this.parentNode).datum().key +
            '</span><span id="variable">' +
            (d[1] - d[0]).toLocaleString() +
            "</span></p>"
        );
}

window.onload = init;
