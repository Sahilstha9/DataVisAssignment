function drawAreaChart(tooltip, properties) {
    const w = 300;
    const h = 100;
    const padding = 50;

    tooltip.selectAll("*").remove();

    var dataset = [];
    if (properties.Y2022 == undefined) {
        tooltip.append("text")
            .attr("class", "plot-title")
            .attr("x", w / 2)
            .attr("y", padding * 2)
            .text("No Data")
            .attr("fill", "black");
    } else {
        for (var i = 2010; i < 2023; i++) {
            var val = properties["Y" + i.toString()];
            dataset.push({
                year: i,
                value: val
            });
        }

        var xScale = d3.scaleTime()
            .domain([
                new Date(2010, 0, 1),
                new Date(2022, 0, 1)
            ])
            .range([0, w]);

        var yScale = d3.scaleLinear()
            .domain([d3.min(dataset, function (d) { return d.value; }),
            d3.max(dataset, function (d) { return d.value; })])
            .range([h, 0]);

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5);

        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);

        var area = d3.area()
            .x(function (d) { return xScale(new Date(d.year, 0, 1)) + padding; })
            .y0(function () { return yScale.range()[0] + padding; })
            .y1(function (d) { return yScale.range()[0] + padding; });  // Start with y1 at the baseline

        var areaPath = tooltip.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("d", area)
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .style("fill", properties.Y2022 > properties.Y2010 ? "green" : "red");

        // Transition to animate the pop-up effect from the bottom
        area
            .y1(function (d) { return yScale(d.value) + padding; });

        areaPath
            .transition()
            .delay(500)
            .duration(1000)
            .attr("d", area);

        tooltip.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(" + padding + ", " + (h + padding) + ")")
            .call(xAxis).style("opacity", 0)  // Start with 0 opacity for transition
            .transition()         // Apply transition
            .duration(500)       // Duration of 1 second
            .style("opacity", 1);

        tooltip.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(" + padding + ", " + padding + ")")
            .call(yAxis)
            .style("opacity", 0)  // Start with 0 opacity for transition
            .transition()         // Apply transition
            .duration(500)       // Duration of 1 second
            .style("opacity", 1);
    }

    tooltip.append("text")
        .attr("class", "plot-title")
        .attr("x", w / 2 - 40)
        .attr("y", padding / 2)
        .text("Life Expectancy over the years")
        .attr("fill", "black");

    tooltip.append("text")
        .attr("class", "plot-text")
        .attr("x", w / 2)
        .attr("y", padding / 2 + 20)
        .text("Country: " + properties.name)
        .attr("fill", "black");
}
