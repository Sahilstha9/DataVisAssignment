// Set up the SVG container
function init() {
    var h = 600,
        w = 1000;
    var xPadding = 150,
        yPadding = 50;

    var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Load the CSV data
    d3.csv("./data/mortality.csv", function (d) {
        return {
            "Country": +d.country,
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
                .keys([
                    "Circulatory system",
                    "Cancer",
                    "Respiratory system",
                    "External causes",
                    "COVID-19",
                ]);

            // Stack the data
            var stackedData = stack(data);

            // Set up the scales
            var xScale = d3
                .scaleBand()
                .domain(
                    data.map(function (d) {
                        return d.Country;
                    })
                )
                .range([xPadding, w - xPadding])
                .padding(0.1);

            var yScale = d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(stackedData, function (d) {
                        return d3.max(d, function (d) {
                            return d[1];
                        });
                    }) + 100,
                ])
                .range([h - yPadding, yPadding]);

            // setting up axes
            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);

            // Set up the colors
            var colorScale = d3
                .scaleOrdinal()
                .domain([
                    "Circulatory system",
                    "Cancer",
                    "Respiratory system",
                    "External causes",
                    "COVID-19",
                ])
                .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]);

            // Create the legend
            var legend = d3.select("#legend");

            var keys = [
                "Circulatory system",
                "Cancer",
                "Respiratory system",
                "External causes",
                "COVID-19",
            ];

            legend
                .selectAll(".legend-item")
                .data(keys)
                .enter()
                .append("div")
                .attr("class", "legend-item")
                .append("div")
                .attr("class", "legend-color")
                .style("background-color", function (d) {
                    return colorScale(d);
                })
                .append("div")
                .attr("class", "legend-label")
                .text(function (d) {
                    return d;
                });

            console.log(stackedData);
            // Create the stacked bars
            svg
                .selectAll("g")
                .data(stackedData)
                .enter()
                .append("g")
                .attr("fill", function (d) {
                    return colorScale(d.key);
                })
                .selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter()
                .append("rect")
                .attr("x", function (d) {
                    return xScale(d.data.Country);
                })
                .attr("y", function (d) {
                    return yScale(d[1]);
                })
                .attr("height", function (d) {
                    return yScale(d[0]) - yScale(d[1]);
                })
                .attr("width", xScale.bandwidth())
                .style("opacity", 0) // Set initial opacity to 0
                // Add transitions
                .on("mouseover", function (event, d) {
                    // Show tooltip
                    d3.select("#tooltip")
                        .style("display", "block")
                        .style("opacity", "1")
                        .style("left", event.pageX + 40 + "px")
                        .style("top", event.pageY - 20 + "px")
                        .select("#value")
                        .html(
                            '<p id="Country">' +
                            d.data.Country +
                            '</p><br><p><span id="property">' +
                            d3.select(this.parentNode).datum().key +
                            '</span><span id="variable">' +
                            (d[1] - d[0]).toLocaleString() +
                            "</span></p>"
                        )
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY - 28 + "px");
                })
                .on("mouseleave", function (event, d) {
                    // Hide tooltip
                    d3.select("#tooltip").style("opacity", 0);
                })
                .transition()
                .duration(1000) // Set the duration of the transition in milliseconds
                .style("opacity", 1); // Transition to full opacity

            // Add axes
            svg
                .append("g")
                .attr("transform", "translate(0," + (h - yPadding) + ")")
                .call(xAxis)
                .attr("fill", "red")
                .selectAll("text")
                .attr("transform", "translate(0," + (yPadding - 40) + ")")
                .attr("fill", "blue")
                .attr("font-weight", "bold")
                .attr("font-size", "25px");

            svg
                .append("g")
                .attr("transform", "translate(" + xPadding + ", 0)")
                .call(yAxis)
                .attr("fill", "red")
                .selectAll("text")
                .attr("transform", "translate(" + (xPadding - 155) + ", 0)")
                .attr("fill", "blue")
                .attr("font-weight", "bold")
                .attr("font-size", "20px");
        })
        .catch(function (error) {
            console.log(error);
        });
}
window.onload = init;