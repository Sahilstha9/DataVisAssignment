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

    text.append("h1").text("Exploring the Relationship Between Health Expenditure and Life Expectancy").style("text-align", "center").style("font-size", "24px").style("font-family", "Arial").style("color", "black");
    text.append("p").text("As we delve deeper into understanding the factors influencing life expectancy, we turn our attention to the relationship between health expenditure and longevity. The scatter plot displayed below juxtaposes life expectancy against the share of GDP allocated to healthcare spending for various countries.");
    text.append("p").text("This visualization allows us to examine whether higher levels of investment in healthcare correspond to longer life expectancies. Each data point represents a country, with the x-axis indicating the percentage of GDP dedicated to health expenditure and the y-axis representing life expectancy.");
    text.append("p").text("Upon initial examination, we observe a general trend indicating that countries with a higher share of GDP allocated to healthcare tend to have longer life expectancies. This suggests that investment in healthcare infrastructure, medical services, and public health initiatives can positively impact population health outcomes.");
    text.append("p").text("However, as we scrutinize the scatter plot more closely, an intriguing insight emerges. While there is indeed a positive correlation between health expenditure and life expectancy, this relationship appears to plateau after a certain threshold. Notably, countries allocating more than 10% of their GDP to healthcare expenditure do not experience significant gains in life expectancy compared to those spending less.");
    text.append("p").text("This observation raises important questions about the efficiency and effectiveness of healthcare spending. It suggests that simply increasing the budget for healthcare may not necessarily lead to substantial improvements in life expectancy beyond a certain point. Instead, it underscores the importance of strategic allocation and targeted investments in healthcare systems to maximize the impact on population health.");
    text.append("p").text("By analyzing the data presented in this scatter plot, policymakers and healthcare professionals can gain valuable insights into how to optimize healthcare spending to achieve better health outcomes for their populations. It serves as a reminder that while financial investment is crucial, it must be coupled with innovative approaches and evidence-based practices to truly enhance life expectancy and well-being.");
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
